/**
 * @license Copyright (c) 2014-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor.js';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat.js';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote.js';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold.js';
import CKFinderUploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter.js';
import Code from '@ckeditor/ckeditor5-basic-styles/src/code.js';
import CodeBlock from '@ckeditor/ckeditor5-code-block/src/codeblock.js';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials.js';
import FontColor from '@ckeditor/ckeditor5-font/src/fontcolor.js';
import FontSize from '@ckeditor/ckeditor5-font/src/fontsize.js';
import Heading from '@ckeditor/ckeditor5-heading/src/heading.js';
import Highlight from '@ckeditor/ckeditor5-highlight/src/highlight.js';
import Image from '@ckeditor/ckeditor5-image/src/image.js';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption.js';
import ImageInsert from '@ckeditor/ckeditor5-image/src/imageinsert.js';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle.js';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar.js';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload.js';
import Indent from '@ckeditor/ckeditor5-indent/src/indent.js';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic.js';
import Link from '@ckeditor/ckeditor5-link/src/link.js';
import List from '@ckeditor/ckeditor5-list/src/list.js';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed.js';
import Mention from '@ckeditor/ckeditor5-mention/src/mention.js';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph.js';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice.js';
import Table from '@ckeditor/ckeditor5-table/src/table.js';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar.js';
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation.js';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline.js';
import WordCount from '@ckeditor/ckeditor5-word-count/src/wordcount.js';

class Editor extends ClassicEditor {}

// Plugins to include in the build.
Editor.builtinPlugins = [
	Autoformat,
	BlockQuote,
	Bold,
	CKFinderUploadAdapter,
	Code,
	CodeBlock,
	Essentials,
	FontColor,
	FontSize,
	Heading,
	Highlight,
	Image,
	ImageCaption,
	ImageInsert,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	Indent,
	Italic,
	Link,
	List,
	MediaEmbed,
	Mention,
	Paragraph,
	PasteFromOffice,
	Table,
	TableToolbar,
	TextTransformation,
	Underline,
	WordCount,
	MentionCustomization
];

// Editor configuration.
Editor.defaultConfig = {
	toolbar: {
		items: [
			'heading',
			'|',
			'bold',
			'italic',
			'underline',
			'link',
			'bulletedList',
			'numberedList',
			'fontColor',
			'fontSize',
			'|',
			'outdent',
			'indent',
			'|',
			'imageUpload',
			'blockQuote',
			'insertTable',
			'mediaEmbed',
			'codeBlock',
			'code',
			'highlight',
			'imageInsert',
			'undo',
			'redo',
		]
	},
	language: 'en',
	image: {
		toolbar: [
			'imageTextAlternative',
			'imageStyle:inline',
			'imageStyle:block',
			'imageStyle:side'
		]
	},
	table: {
		contentToolbar: [
			'tableColumn',
			'tableRow',
			'mergeTableCells'
		]
	}
};


function MentionCustomization (editor) {

	// The upcast converter will convert view <a class="mention" href="" data-user-id="">
	// elements to the model 'mention' text attribute.
	editor.conversion.for('upcast').elementToAttribute({
	  view: {
		name: 'a',
		key: 'data-mention',
		classes: 'mention',
		attributes: {
		  href: true,
		  'data-user-id': true,
		},
	  },
	  model: {
		key: 'mention',
		value: (viewItem) => {
		  // The mention feature expects that the mention attribute value
		  // in the model is a plain object with a set of additional attributes.
		  // In order to create a proper object use the toMentionAttribute() helper method:
		  const mentionAttribute = editor.plugins
			.get('Mention')
			.toMentionAttribute(viewItem, {
			  // Add any other properties that you need.
			  link: viewItem.getAttribute('href'),
			  userId: viewItem.getAttribute('data-user-id'),
			})
  
		  return mentionAttribute
		},
	  },
	  converterPriority: 'high',
	})
  
	// Downcast the model 'mention' text attribute to a view <a> element.
	editor.conversion.for('downcast').attributeToElement({
	  model: 'mention',
	  view: (modelAttributeValue, { writer }) => {
		// Do not convert empty attributes (lack of value means no mention).
		if (!modelAttributeValue) {
		  return
		}
  
		return writer.createAttributeElement(
		  'a',
		  {
			class: 'mention',
			'data-mention': modelAttributeValue.id,
			'data-user-id': modelAttributeValue.userId,
			href: modelAttributeValue.link,
		  },
		  {
			// Make mention attribute to be wrapped by other attribute elements.
			priority: 20,
			// Prevent merging mentions together.
			id: modelAttributeValue.uid,
		  }
		)
	  },
	  converterPriority: 'high',
	})
  }

export default Editor;
