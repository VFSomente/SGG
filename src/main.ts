import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

async function main() {
  try {
    const ngCore = await import('@angular/core');
    if (typeof (ngCore as any).ɵresolveComponentResources === 'function') {
      await (ngCore as any).ɵresolveComponentResources();
    }
    await bootstrapApplication(App, appConfig);
  } catch (err) {
    console.error(err);
  }
}

void main();
