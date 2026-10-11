const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const stylesDirectory = path.join(projectRoot, 'public', 'styles');
const entryFile = path.join(stylesDirectory, 'index.css');
const outputFile = path.join(stylesDirectory, 'bundle.css');
const importPattern = /@import\s+(['"])([^'"]+)\1\s*;/g;

const bundleImports = (filePath, importStack = []) => {
	if (importStack.includes(filePath)) {
		throw new Error(`Circular CSS import: ${[...importStack, filePath].join(' -> ')}`);
	}

	const source = fs.readFileSync(filePath, 'utf8');
	const nextImportStack = [...importStack, filePath];

	return source.replace(importPattern, (_statement, _quote, importPath) => {
		const importedFile = path.resolve(path.dirname(filePath), importPath);
		if (!importedFile.startsWith(`${stylesDirectory}${path.sep}`)) {
			throw new Error(`CSS import must stay inside ${stylesDirectory}: ${importPath}`);
		}

		return bundleImports(importedFile, nextImportStack);
	});
};

fs.writeFileSync(outputFile, bundleImports(entryFile));
console.log(`CSS bundle created: ${path.relative(projectRoot, outputFile)}`);
