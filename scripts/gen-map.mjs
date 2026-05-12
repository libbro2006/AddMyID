#!/usr/bin/env node
// One-time script: fetches US states topojson from CDN (no npm install needed)
// and converts it to SVG path strings. Run once, commit the output.
// Usage: node scripts/gen-map.mjs

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const FIPS_TO_ABBR = {
  '01': 'AL', '02': 'AK', '04': 'AZ', '05': 'AR', '06': 'CA',
  '08': 'CO', '09': 'CT', '10': 'DE', '11': 'DC', '12': 'FL',
  '13': 'GA', '15': 'HI', '16': 'ID', '17': 'IL', '18': 'IN',
  '19': 'IA', '20': 'KS', '21': 'KY', '22': 'LA', '23': 'ME',
  '24': 'MD', '25': 'MA', '26': 'MI', '27': 'MN', '28': 'MS',
  '29': 'MO', '30': 'MT', '31': 'NE', '32': 'NV', '33': 'NH',
  '34': 'NJ', '35': 'NM', '36': 'NY', '37': 'NC', '38': 'ND',
  '39': 'OH', '40': 'OK', '41': 'OR', '42': 'PA', '44': 'RI',
  '45': 'SC', '46': 'SD', '47': 'TN', '48': 'TX', '49': 'UT',
  '50': 'VT', '51': 'VA', '53': 'WA', '54': 'WV', '55': 'WI',
  '56': 'WY', '72': 'PR',
};

// Topojson arc decoder — no npm needed.
// Spec: arcs are delta-encoded quantized integer coordinate sequences.
// Transform converts integer → float: x_float = (x_int * scale[0]) + translate[0]
function decodeTopo(topo) {
  const { scale: [sx, sy], translate: [tx, ty] } = topo.transform;

  const decodedArcs = topo.arcs.map(arc => {
    let x = 0, y = 0;
    return arc.map(([dx, dy]) => [(x += dx) * sx + tx, (y += dy) * sy + ty]);
  });

  // Stitch arc indices into a coordinate ring.
  // Positive idx → arc forward; negative idx → arc[~idx] reversed.
  // Adjacent arcs share a junction point; skip the first point of each
  // subsequent arc to avoid duplicating it. The final point duplicates
  // the first (ring closure), so pop it before building the SVG path.
  function buildRing(arcIndices) {
    const coords = [];
    for (const idx of arcIndices) {
      const arc = idx < 0 ? [...decodedArcs[~idx]].reverse() : decodedArcs[idx];
      coords.push(...(coords.length > 0 ? arc.slice(1) : arc));
    }
    if (coords.length > 1) coords.pop();
    return coords;
  }

  function ringToPath(ring) {
    return ring
      .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`)
      .join('') + 'Z';
  }

  function geomToPath(geom) {
    if (geom.type === 'Polygon') {
      return geom.arcs.map(ring => ringToPath(buildRing(ring))).join(' ');
    }
    if (geom.type === 'MultiPolygon') {
      return geom.arcs.flatMap(poly => poly.map(ring => ringToPath(buildRing(ring)))).join(' ');
    }
    return '';
  }

  return topo.objects.states.geometries
    .map(geom => {
      const fips = String(geom.id).padStart(2, '0');
      const abbr = FIPS_TO_ABBR[fips];
      if (!abbr) {
        console.warn(`Unknown FIPS: ${fips} — skipping`);
        return null;
      }
      return { abbr, d: geomToPath(geom) };
    })
    .filter(Boolean);
}

async function main() {
  console.log('Fetching US states topojson from jsDelivr CDN...');
  const res = await fetch(
    'https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json'
  );
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching topojson`);
  const topo = await res.json();

  const paths = decodeTopo(topo);

  const out = join(__dirname, '../src/data/map-paths.json');
  writeFileSync(out, JSON.stringify(paths));
  console.log(`Wrote ${paths.length} state paths → src/data/map-paths.json`);
}

main().catch(e => { console.error(e); process.exit(1); });
