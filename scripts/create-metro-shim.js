const fs = require('fs');
const path = require('path');

// Path to shim file inside node_modules. When running in EAS build this
// will write into the fresh install's node_modules so @expo/metro-config can
// require the internal module it expects.
const shimPath = path.join(process.cwd(), 'node_modules', 'metro', 'src', 'ModuleGraph', 'worker', 'importLocationsPlugin.js');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function writeShim() {
  const dir = path.dirname(shimPath);
  ensureDir(dir);

  if (fs.existsSync(shimPath)) {
    // already present
    return;
  }

  const content = '// Minimal shim for Metro\'s importLocationsPlugin expected by\n'
    + '// @expo/metro-config. Provides locToKey and importLocationsPlugin.\n\n'
    + 'function locToKey(loc) {\n'
    + "  if (!loc) return '';\n"
    + "  if (loc.start && typeof loc.start.line === 'number') {\n"
    + "    return \"\${loc.start.line}:\${loc.start.column}\";\n"
    + "  }\n"
    + "  if (typeof loc.line === 'number') {\n"
    + "    return \"\${loc.line}:\${loc.column}\";\n"
    + "  }\n"
    + "  try {\n"
    + "    return JSON.stringify(loc);\n"
    + "  } catch (e) {\n"
    + "    return String(loc);\n"
    + "  }\n"
    + "}\n\n"
    + "function importLocationsPlugin() {\n"
    + "  return {\n"
    + "    name: 'expo-import-locations-plugin-shim',\n"
    + "    visitor: {},\n"
    + "  };\n"
    + "}\n\n"
    + "module.exports = { locToKey, importLocationsPlugin };\n";

  try {
    fs.writeFileSync(shimPath, content, { encoding: 'utf8' });
    // keep file readable in CI logs
    console.log('[create-metro-shim] Wrote shim to', shimPath);
  } catch (err) {
    // don't fail the install — log error for diagnostics
    console.error('[create-metro-shim] Failed to write shim:', err && err.message);
  }
}

writeShim();
