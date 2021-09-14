import { SnapshotService } from '../../sync';
import { WrapperComponent } from '../component-generator/wrapper/wrapper-component';
import { ComponentService } from '../component-generator/component-service';
import { ConfigGenerator } from './config-generator';
import { WrapperComponentGenerator } from '../component-generator/wrapper/wrapper-component-generator';

export class SyncService {
  static async sync(dirname){
    const config = this.ensureConfig(dirname);
    config.dirname = dirname;

    const updateTest = false;
    const updateSnapshot = false;
    
    const classes = Object.getOwnPropertyNames(config.namespaces);
    const excludedToSyncClasses = Object.getOwnPropertyNames(config.excludedToSync);
  
    for(const className of classes){
      if(excludedToSyncClasses.filter((item) => item === className).length > 0){
        continue;
      }
      if(className === WrapperComponent.name){
        await ComponentService.sync(config);
        continue;
      }
  
      const classTarget = config.namespaces[className];
      if(classTarget){
        await SnapshotService.sync(classTarget, updateTest, updateSnapshot, config);
      }
    }
  }

  static ensureConfig(dirname){
    WrapperComponentGenerator.generate(dirname);
    const configPath = ConfigGenerator.generate(dirname);
    const config = require(configPath);

    return config;
  }
}
