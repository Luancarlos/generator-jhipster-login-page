
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
const mkdirp = require('mkdirp');
const constants = require('generator-jhipster/generators/generator-constants');

/* Constants use throughout */
const MAIN_SRC_DIR = constants.CLIENT_MAIN_SRC_DIR;
const TEST_SRC_DIR = constants.CLIENT_TEST_SRC_DIR;
const ANGULAR_DIR = constants.ANGULAR_DIR;

/**
 * The default is to use a file path string. It implies use of the template method.
 * For any other config an object { file:.., method:.., template:.. } can be used
 */
const files = {

    sass: [
        {
            path: MAIN_SRC_DIR,
            templates: ['content/scss/_bootstrap-variables.scss', 'content/scss/global.scss', 'content/scss/vendor.scss']
        },
        {
            condition: generator => generator.enableI18nRTL,
            path: MAIN_SRC_DIR,
            templates: ['content/scss/rtl.scss']
        }
    ],
    image: [
        {
            path: MAIN_SRC_DIR,
            templates: [
                { file: 'content/images/loading.gif', method: 'copy' },
                { file: 'content/images/bannerlogin.gif', method: 'copy' }
            ]
        }
    ],
    commonWeb: [
        {
            path: MAIN_SRC_DIR,
            templates: [
                'index.html',
            ]
        }
    ],
    angularApp: [
        {
            path: ANGULAR_DIR,
            templates: [
                'app.main.ts',
                'app.module.ts',
                'app-routing.module.ts',
            ]
        }
    ],
    angularMain: [
        {
            path: ANGULAR_DIR,
            templates: [
                // home module
                { file: 'home/home.route.ts', method: 'processJs' },
                { file: 'home/home.component.html', method: 'processHtml' },
                // login module
                { file: 'login/login.module.ts', method: 'processJs' },
                { file: 'login/login.route.ts', method: 'processJs' },
                { file: 'login/login.component.ts', method: 'processJs' },
                { file: 'login/login.component.html', method: 'processHtml' },
                // layouts
                'layouts/main/main.component.ts',
                'layouts/main/main.component.html',
                { file: 'layouts/navbar/navbar.component.html', method: 'processHtml' },
                { file: 'layouts/error/error.component.html', method: 'processHtml' }
            ]
        },
        {
            path: ANGULAR_DIR,
            templates: ['login/login.component.scss']
        }
    ],
    angularAccountModule: [
        {
            path: ANGULAR_DIR,
            condition: generator => generator.authenticationType !== 'oauth2',
            templates: [

                { file: 'account/activate/activate.component.html', method: 'processHtml' },
                { file: 'account/password/password.component.html', method: 'processHtml' },
                { file: 'account/register/register.component.html', method: 'processHtml' },
                { file: 'account/password-reset/init/password-reset-init.component.html', method: 'processHtml' },
                { file: 'account/password-reset/finish/password-reset-finish.component.html', method: 'processHtml' },
                { file: 'account/settings/settings.component.html', method: 'processHtml' }
            ]
        },
        {
            condition: generator => generator.authenticationType === 'session',
            path: ANGULAR_DIR,
            templates: [
                { file: 'account/sessions/sessions.component.html', method: 'processHtml' },
            ]
        },
        {
            condition: generator => generator.authenticationType !== 'oauth2',
            path: ANGULAR_DIR,
            templates: ['account/password/password-strength-bar.scss']
        }
    ],
    angularAdminModule: [
        {
            path: ANGULAR_DIR,
            templates: [
                { file: 'admin/configuration/configuration.component.html', method: 'processHtml' },
                'admin/docs/docs.component.html',
                { file: 'admin/health/health.component.html', method: 'processHtml' },
                { file: 'admin/logs/logs.component.html', method: 'processHtml' },
                { file: 'admin/metrics/metrics.component.html', method: 'processHtml', template: true },
            ]
        },
        {
            condition: generator => generator.databaseType !== 'no' && generator.databaseType !== 'cassandra',
            path: ANGULAR_DIR,
            templates: [
                { file: 'admin/audits/audits.component.html', method: 'processHtml' },
            ]
        },
        {
            condition: generator => generator.websocket === 'spring-websocket',
            path: ANGULAR_DIR,
            templates: [
                { file: 'admin/tracker/tracker.component.html', method: 'processHtml' },
            ]
        },
        {
            condition: generator => !generator.skipUserManagement,
            path: ANGULAR_DIR,
            templates: [
                { file: 'admin/user-management/user-management.component.html', method: 'processHtml' },
                { file: 'admin/user-management/user-management-detail.component.html', method: 'processHtml' },
                { file: 'admin/user-management/user-management-update.component.html', method: 'processHtml' }
            ]
        },
        {
            condition: generator => generator.applicationType === 'gateway' && generator.serviceDiscoveryType,
            path: ANGULAR_DIR,
            templates: [
                { file: 'admin/gateway/gateway.component.html', method: 'processHtml' },
            ]
        }
    ],
    angularAuthService: [
        {
            path: ANGULAR_DIR,
            templates: [
                'core/auth/user-route-access-service.ts'
            ]
        }
    ]
};

module.exports = {
    writeFiles,
    files
};

function writeFiles() {
    mkdirp(MAIN_SRC_DIR);
    // write angular 2.x and above files
    this.writeFilesToDisk(files, this, false, './angular');
}
