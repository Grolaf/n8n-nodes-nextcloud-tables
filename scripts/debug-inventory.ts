#!/usr/bin/env npx ts-node

/**
 * 🗂️ Debug-Inventar Generator
 * Generiert Reports und ermöglicht Debug-Point-Management
 */

import { DebugInventory, DebugHelper, registerDebugPoints } from '../nodes/NextcloudTables/helpers/debug.helper';
import * as fs from 'fs';
import * as path from 'path';

// Debug-Points registrieren
registerDebugPoints();

/**
 * Generiert Debug-Inventar-Report
 */
function generateInventoryReport(): void {
	const report = DebugInventory.generateReport();
	
	// In Datei speichern
	const reportPath = path.join(__dirname, '..', 'DEBUG-INVENTORY.md');
	fs.writeFileSync(reportPath, report, 'utf8');
	
	console.log('✅ Debug-Inventar-Report generiert:', reportPath);
	console.log('\n' + report);
}

/**
 * Zeigt Debug-Status für bestimmte Kategorie
 */
function showCategoryStatus(category: string): void {
	const entries = DebugInventory.getByCategory(category as any);
	
	console.log(`\n📂 ${category.toUpperCase()} Debug-Points:`);
	entries.forEach(entry => {
		const status = entry.enabled ? '✅' : '❌';
		console.log(`  ${status} ${entry.id} - ${entry.description}`);
	});
}

/**
 * Aktiviert/Deaktiviert Debug-Kategorie
 */
function setCategoryStatus(category: string, enabled: boolean): void {
	DebugInventory.setCategoryEnabled(category as any, enabled);
	console.log(`${enabled ? '✅ Aktiviert' : '❌ Deaktiviert'}: ${category}`);
}

/**
 * Generiert Production-Cleanup-Liste
 */
function generateCleanupList(): void {
	const devEntries = DebugInventory.getByPhase('development');
	const testEntries = DebugInventory.getByPhase('testing');
	
	let cleanup = '# 🧹 Debug-Cleanup für Production\n\n';
	cleanup += '## 🚨 Zu entfernen (Development)\n\n';
	
	devEntries.forEach(entry => {
		cleanup += `- [ ] **${entry.id}** in \`${entry.location}\`\n`;
	});
	
	cleanup += '\n## ⚠️ Zu deaktivieren (Testing)\n\n';
	
	testEntries.forEach(entry => {
		cleanup += `- [ ] **${entry.id}** in \`${entry.location}\`\n`;
	});
	
	const cleanupPath = path.join(__dirname, '..', 'DEBUG-CLEANUP.md');
	fs.writeFileSync(cleanupPath, cleanup, 'utf8');
	
	console.log('✅ Debug-Cleanup-Liste generiert:', cleanupPath);
}

/**
 * Main CLI Interface
 */
function main(): void {
	const args = process.argv.slice(2);
	const command = args[0];
	
	switch (command) {
		case 'report':
			generateInventoryReport();
			break;
			
		case 'category':
			const category = args[1];
			if (!category) {
				console.error('❌ Kategorie erforderlich: npm run debug:category api');
				return;
			}
			showCategoryStatus(category);
			break;
			
		case 'enable':
			const enableCategory = args[1];
			if (!enableCategory) {
				console.error('❌ Kategorie erforderlich: npm run debug:enable api');
				return;
			}
			setCategoryStatus(enableCategory, true);
			break;
			
		case 'disable':
			const disableCategory = args[1];
			if (!disableCategory) {
				console.error('❌ Kategorie erforderlich: npm run debug:disable api');
				return;
			}
			setCategoryStatus(disableCategory, false);
			break;
			
		case 'cleanup':
			generateCleanupList();
			break;
			
		case 'stats':
			const all = DebugInventory.getAll();
			const enabled = all.filter(e => e.enabled).length;
			const categories = [...new Set(all.map(e => e.category))];
			
			console.log(`\n📊 Debug-Statistics:`);
			console.log(`  📈 Total Debug-Points: ${all.length}`);
			console.log(`  ✅ Enabled: ${enabled}`);
			console.log(`  ❌ Disabled: ${all.length - enabled}`);
			console.log(`  📂 Categories: ${categories.length}`);
			console.log(`  🏷️  Categories: ${categories.join(', ')}`);
			break;
			
		default:
			console.log(`
🐛 Debug-Inventar CLI

📋 Verfügbare Befehle:
  report          - Generiert vollständigen Debug-Report
  category <cat>  - Zeigt Status einer Kategorie
  enable <cat>    - Aktiviert alle Debug-Points einer Kategorie
  disable <cat>   - Deaktiviert alle Debug-Points einer Kategorie
  cleanup         - Generiert Production-Cleanup-Liste
  stats           - Zeigt Debug-Statistiken

🏷️ Kategorien:
  api, validation, row-operations, share-operations,
  column-operations, table-operations, view-operations,
  import-operations, resource-locator, data-formatting,
  authentication, error-handling

📝 Beispiele:
  npm run debug:report
  npm run debug:category api
  npm run debug:enable share-operations
  npm run debug:cleanup
			`);
			break;
	}
}

// CLI ausführen
main(); 