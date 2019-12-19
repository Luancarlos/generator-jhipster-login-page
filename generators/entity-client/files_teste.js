/**
 * Copyright 2013-2019 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see https://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const _ = require('lodash');
const Randexp = require('randexp');
const utils = require('generator-jhipster/generators/utils');
const constants = require('generator-jhipster/generators/generator-constants');

/* Constants use throughout */
const ANGULAR_DIR = constants.ANGULAR_DIR;

const CLIENT_NG2_TEMPLATES_DIR = 'angular';

/**
 * The default is to use a file path string. It implies use of the template method.
 * For any other config an object { file:.., method:.., template:.. } can be used
 */

const angularFiles = {
    client: [
        {
            path: ANGULAR_DIR,
            templates: [
                {
                    file: 'entities/teste.ts',
                    renameTo: generator => 'entities/teste/teste.ts'
                }
            ]
        }
    ]
};

module.exports = {
    writeFiles,
    angularFiles
};

function addEnumerationFiles(generator, templateDir, clientFolder) {
    generator.fields.forEach(field => {
        if (field.fieldIsEnum === true) {
            const enumFileName = _.kebabCase(field.fieldType);
            const enumInfo = utils.buildEnumInfo(field, generator.angularAppName, generator.packageName, generator.clientRootFolder);
            if (!generator.skipClient) {
                generator.template(
                    `${generator.fetchFromInstalledJHipster(
                        `entity-client/templates/${templateDir}`
                    )}/${clientFolder}entities/enumerations/enum.model.ts.ejs`,
                    `${clientFolder}shared/model/enumerations/${enumFileName}.model.ts`,
                    generator,
                    {},
                    enumInfo
                );
            }
        }
    });
}

function addSampleRegexTestingStrings(generator) {
    generator.fields.forEach(field => {
        if (field.fieldValidateRulesPattern !== undefined) {
            const randExp = new Randexp(field.fieldValidateRulesPattern);
            randExp.max = 5;
            // In order to have consistent results with RandExp, the RNG is seeded.
            randExp.randInt = generator.seededRandomNumberGenerator(10);
            field.fieldValidateSampleString = randExp.gen();
        }
    });
}

function writeFiles() {
    return {
        writeClientFiles() {
            if (this.skipClient) return;
            addSampleRegexTestingStrings(this);
            if (this.clientFramework === 'angularX') {
                // write client side files for angular 2.x +
                // eslint-disable-next-line prettier/prettier
                this.writeFilesToDisk(
                    angularFiles,
                    this,
                    false,
                    `./${CLIENT_NG2_TEMPLATES_DIR}`
                );
                this.addEntityToModule(
                    this.entityInstance,
                    this.entityClass,
                    this.entityAngularName,
                    this.entityFolderName,
                    this.entityFileName,
                    this.entityUrl,
                    this.clientFramework,
                    this.microserviceName
                );

                addEnumerationFiles(this, CLIENT_NG2_TEMPLATES_DIR, ANGULAR_DIR);
            }
            this.addEntityToMenu(this.entityStateName, this.enableTranslation, this.clientFramework, this.entityTranslationKeyMenu);
        }
    };
}
