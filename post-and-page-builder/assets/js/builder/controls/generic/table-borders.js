window.BOLDGRID = window.BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};
BOLDGRID.EDITOR.CONTROLS.GENERIC = BOLDGRID.EDITOR.CONTROLS.GENERIC || {};

import template from '../../../../../includes/template/customize/table-borders.html';

( function( $ ) {
	'use strict';

	var self,
		BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.CONTROLS.GENERIC.Tableborders = {
		template: _.template( template ),

		data: {
			testData: 'testData',
			borderTypes: [
				{
					name: 'row-borders',
					label: 'Row Borders',
					property: 'top',
					dataAttr: 'row-borders',
					type: 'row'
				},
				{
					name: 'column-borders',
					label: 'Column Borders',
					property: 'right',
					dataAttr: 'column-borders',
					type: 'column'
				},
				{
					name: 'heading-borders',
					label: 'Heading Borders',
					property: 'top',
					dataAttr: 'heading-borders',
					type: 'heading'
				}
			],
			controls: {}
		},

		/**
		 * Render the control.
		 *
		 * @since 1.21.0
		 *
		 * @returns {object} control jQuery object.
		 */
		render: function() {
			var $tableBorderControl;
			this.data.borderTypes.forEach( function( borderType ) {
				var borderTypeControl = self.getBorderTypeMarkup( borderType );
				var borderSlider = self.getSliderMarkup( borderType );
				var borderColor = self.getBorderColorMarkup( borderType );

				self.data.controls[borderType.name] = {
					borderSlider: borderSlider,
					borderTypeControl: borderTypeControl,
					borderColor: borderColor
				};
			} );
			$tableBorderControl = $( this.template( this.data ) );

			BG.Panel.$element
				.find( '.panel-body .customize' )
				.find( '.section .generic-table-borders' )
				.remove();

			BG.Panel.$element.find( '.panel-body .customize' ).append( $tableBorderControl );

			return $tableBorderControl;
		},

		/**
		 * Get Border Type Markup.
		 *
		 * Generates the markup for the border type control.
		 *
		 * @since 1.21.0
		 *
		 * @param {Object} options Set of Options for the control.
		 *
		 * @returns {String} Markup for the control.
		 */
		getBorderTypeMarkup: function( options ) {
			return `<div class="border-type-control">
                    <h4 class="control-title">Border Type</h4>
                    <ul>
                        <li><label><input type="radio" name="${
													options.name
												}-type" checked="checked" value="">Inherit</label></li>
                        <li><label><input type="radio" name="${
													options.name
												}-type" value="none">None</label></li>
                        <li><label><input type="radio" name="${
													options.name
												}-type" value="dashed">Dashed</label></li>
                        <li><label><input type="radio" name="${
													options.name
												}-type" value="double">Double</label></li>
                        <li><label><input type="radio" name="${
													options.name
												}-type" value="solid">Solid</label></li>
                        <li><label><input type="radio" name="${
													options.name
												}-type" value="dotted">Dotted</label></li>
                    </ul>
                </div>`;
		},

		/**
		 * Get Slider Markup.
		 *
		 * Generates the markup for the border width controls.
		 *
		 * @since 1.21.0
		 *
		 * @param {Object} options Set of Options for the control.
		 *
		 * @returns {String} Markup for the control.
		 */
		getSliderMarkup: function( options ) {
			return `<div data-tooltip-id='${options.name}' class='${options.name} section'>
                    <h4>${options.label} (px)</h4>
                    <div class="slider"></div>
                    <span class='value'></span>
                </div>`;
		},

		/**
		 * Get Border Color Markup.
		 *
		 * Generates the markup for the border color controls.
		 *
		 * @since 1.21.0
		 *
		 * @param {Object} options Set of Options for the control.
		 *
		 * @returns {String} Markup for the control.
		 */
		getBorderColorMarkup: function( options ) {
			return `<div class='${options.name}-color section color-controls'>
                    <h4>Border Color</h4>
                    <label for="${options.name}-color" class='color-preview'></label>
                    <input type="text" data-type="" name='${
											options.name
										}-color' class='color-control' value='rgba(0,0,0,1)'>
                    <div>
                        <a class="default-color" href="#">Reset to Default</a>
                    </div>
                </div>`;
		},

		/**
		 * Initialize Slider
		 *
		 * Initializes the jQuery Slider object.
		 *
		 * @param {jQuery Object} $slider jQuery object for the slider.
		 * @param {Object} options Set of Options for the control.
		 */
		initSlider: function( $slider, options ) {
			var $target = BG.Menu.getCurrentTarget(),
				defaultValue = $target.attr( `data-${options.name}-width` ) || 0;

			$slider.siblings( '.value' ).text( defaultValue );

			$slider.slider( {
				min: 0,
				max: 20,
				range: 'max',
				value: defaultValue,
				slide: function( event, ui ) {
					self.applyBorderStyle( ui.value, options, 'width' );
				}
			} );
		},

		/**
		 * Bind Border Type.
		 *
		 * Binds the onChange event for the Border Type control.
		 *
		 * @since 1.21.0
		 *
		 * @param {jQuery Object} $borderTypeControl jQuery object for the control.
		 * @param {Object} options Set of Options for the control.
		 */
		bindBorderType: function( $borderTypeControl, options ) {
			var $target = BG.Menu.getCurrentTarget(),
				defaultValue = $target.attr( `data-${options.name}-style` ) || '';

			$borderTypeControl.each( function() {
				var $this = $( this );
				$this.prop( 'checked', false );
				if ( $this.val() === defaultValue ) {
					$this.prop( 'checked', true );
				}
			} );

			$borderTypeControl.on( 'change', function() {
				var $this = $( this );

				if ( $this.prop( 'checked' ) ) {
					self.applyBorderStyle( $this.val(), options, 'style' );
				}
			} );
		},

		/**
		 * Bind Border Color.
		 *
		 * Binds the onChange event for the Border Color control.
		 *
		 * @since 1.21.0
		 *
		 * @param {jQuery Object} $colorControl jQuery object for the control.
		 * @param {Object} options Set of Options for the control.
		 */
		bindColorControl: function( $colorControl, options ) {
			var $target = BG.Menu.getCurrentTarget(),
				defaultValue = $target.attr( `data-${options.name}-color` ) || '#000';

			$colorControl.val( defaultValue );
			$colorControl.siblings( 'label' ).css( 'background-color', defaultValue );

			$colorControl.on( 'change', function() {
				var $this = $( this );

				// If $this.val() is a single digit or 'neutral' color, then convert it to a color variable.
				if ( $this.val().length === 1 || $this.val() === 'neutral' ) {
					$this.val( `var(--color-${$this.val()})` );
				}

				self.applyBorderStyle( $this.val(), options, 'color' );
			} );
		},

		/**
		 * Applies the Border Style changes.
		 *
		 * @param {string} value Border Type string.
		 * @param {Object} options Set of Options for the control.
		 * @param {string} styleSuffix Border Style suffix.
		 */
		applyBorderStyle: function( value, options, styleSuffix ) {
			var $target = BG.Menu.getCurrentTarget(),
				nodeTypes = 'td, th';
			$target.attr( `data-${options.name}-${styleSuffix}`, value );

			if ( 'column' === options.type ) {
				let nodes = $target.find( nodeTypes );
				nodes.each( function() {
					var $this = $( this );

					let property                            = {};
					property[`border-right-${styleSuffix}`] = value;
					property[`border-left-${styleSuffix}`]  = value;

					window.BOLDGRID.CONTROLS.addStyles(
						$this,
						property
					);

					if ( ! value && 'style' === styleSuffix ) {
						window.BOLDGRID.CONTROLS.addStyles(
							$this,
							{
								'border-left-width': '',
								'border-right-width': '',
								'border-left-color': '',
								'border-right-color': ''
							}
						);
					}
				} );
			}

			if ( 'row' === options.type ) {
				let rows = $target.find( 'tbody tr' );
				rows.each( function() {
					var $this = $( this );

					let property                             = {};
					property[`border-top-${styleSuffix}`]    = value;
					property[`border-bottom-${styleSuffix}`] = value;

					window.BOLDGRID.CONTROLS.addStyles(
						$this.find( nodeTypes ),
						property
					);

					if ( ! value && 'style' === styleSuffix ) {
						window.BOLDGRID.CONTROLS.addStyles(
							$this.find( nodeTypes ),
							{
								'border-top-width': '',
								'border-bottom-width': '',
								'border-top-color': '',
								'border-bottom-color': ''
							}
						);
					}
				} );
			}

			if ( 'heading' === options.type ) {
				let nodes = $target.find( 'thead' ).find( nodeTypes );
				nodes.each( function() {
					var $this = $( this );

					let property                             = {};
					property[`border-top-${styleSuffix}`]    = value;
					property[`border-bottom-${styleSuffix}`] = value;

					window.BOLDGRID.CONTROLS.addStyles(
						$this,
						property
					);

					if ( ! value && 'style' === styleSuffix ) {
						window.BOLDGRID.CONTROLS.addStyles(
							$this,
							{
								'border-top-width': '',
								'border-bottom-width': '',
								'border-top-color': '',
								'border-bottom-color': ''
							}
						);
					}
				} );
			}
		},

		/**
		 * Bind Container Collapse.
		 *
		 * This handles collapsing of border sections in the panel.
		 * @param {jQuery Object} $section Border Control Section.
		 */
		bindContainerCollapse: function( $section ) {
			var $containers = $section.find( '.border-control-container' );

			$containers.each( function() {
				var $this = $( this ),
					$heading = $this.find( '.border-control-heading' );
				$heading.on( 'click', function() {
					$( this )
						.parent()
						.toggleClass( 'collapsed' );
				} );
			} );
		},

		/**
		 * Bind event.
		 *
		 * @since 1.21.0
		 */
		bind: function() {
			var $section = BG.Panel.$element.find( '.customize .generic-table-borders' );

			this.data.borderTypes.forEach( function( borderType ) {
				var $slider = $section.find( `.${borderType.name} .slider` ),
					$borderTypeInputs = $section.find( `input[name="${borderType.name}-type"]` ),
					$borderColorInput = $section.find( `.${borderType.name}-color.color-controls input` );
				self.initSlider( $slider, borderType );
				self.bindBorderType( $borderTypeInputs, borderType );
				self.bindColorControl( $borderColorInput, borderType );
				self.bindContainerCollapse( $section );
			} );
		}
	};

	self = BOLDGRID.EDITOR.CONTROLS.GENERIC.Tableborders;
} )( jQuery );
