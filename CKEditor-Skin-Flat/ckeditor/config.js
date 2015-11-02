/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
    // config.uiColor = '#AADC6E';

    config.toolbar = [
    ['Maximize'],
    ['Source', '-', 'ShowBlocks', '-', 'NewPage', 'Preview', '-'],
    ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'],
    [ 'Scayt' ],
    '/',
    ['Image', 'Table', 'HorizontalRule', 'SpecialChar', '-', 'Blockquote', 'CreateDiv'],
    ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent'],
    ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl'],
    ['Link', 'Unlink'],
    '/',
    ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat'],
    ['Styles', 'Format', 'Font', 'FontSize'],
    ['TextColor', 'BGColor']
    ];

    // Remove some buttons provided by the standard plugins, which are
    // not needed in the Standard(s) toolbar.
    config.removeButtons = 'Underline,Subscript,Superscript';

    // Set the most common block elements.
    config.format_tags = 'p;h1;h2;h3;pre';
    // Simplify the dialog windows.
    config.removeDialogTabs = 'image:advanced;link:advanced';

    config.skin = 'flat';
    config.removePlugins = 'elementspath,resize';
};
