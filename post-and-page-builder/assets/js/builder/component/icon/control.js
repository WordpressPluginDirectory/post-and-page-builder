window.BOLDGRID = window.BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

( function( $ ) {
	'use strict';

	var self,
		BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.CONTROLS.Icon = {
		name: 'icon',

		priority: 80,

		tooltip: 'Icon Design',

		iconClasses: 'fa fa-cog',

		selectors: [ '.fa' ],

		/**
		 * Panel Settings.
		 *
		 * @since 1.2.7
		 */
		panel: {
			title: 'Change Icon',
			height: '735px',
			width: '335px',
			includeFooter: true,
			customizeLeaveCallback: true,
			customizeCallback: true,
			customizeSupport: [
				'fontColor',
				'fontSize',
				'margin',
				'padding',
				'rotate',
				'box-shadow',
				'border',
				'border-radius',
				'background-color',
				'device-visibility',
				'animation',
				'customClasses'
			]
		},

		template: wp.template( 'boldgrid-editor-icon' ),

		init: function() {
			BOLDGRID.EDITOR.Controls.registerControl( this );
		},

		/**
		 * Load the control. This is only run once.
		 *
		 * @since 1.2.7
		 */
		setup: function() {
			self._setupClosePanel();
			self._setupCustomizeLeave();
			self.registerComponent();
		},

		/**
		 * Register the componet in the Add Components panel.
		 *
		 * @since 1.8.0
		 */
		registerComponent() {
			let config = {
				name: 'icon',
				title: 'Icon',
				type: 'design',
				icon: '<span class="dashicons dashicons-star-filled"></span>',
				getDragElement: () => self.getSample()
			};

			BG.Service.component.register( config );
		},

		/**
		 * When the user clicks on an icon automatically open the panel.
		 *
		 * @since 1.2.7
		 */
		elementClick: function() {
			self.openPanel();
		},

		/**
		 * When a user leaves the customize section highlight the element.
		 *
		 * @since 1.2.7
		 */
		_setupCustomizeLeave: function() {
			BG.Panel.$element.on( 'bg-customize-exit', function() {
				if ( self.name === BG.Panel.currentControl.name ) {
					self.highlightElement();
				}
			} );
		},

		/**
		 * When the user closes the Panel, unselect the current icon.
		 *
		 * @since 1.2.7
		 */
		_setupClosePanel: function() {
			BG.Panel.$element.on( 'bg-panel-close', function() {
				if ( BG.Panel.currentControl && self.name === BG.Panel.currentControl.name ) {
					self.collapseSelection();
				}
			} );
		},

		/**
		 * Unselect current mce selection.
		 *
		 * @since 1.2.7
		 */
		collapseSelection: function() {
			BOLDGRID.EDITOR.mce.execCommand( 'wp_link_cancel' );
		},

		/**
		 * Get a sample icon.
		 *
		 * @since 1.8.0
		 *
		 * @return {string} HTML for icon.
		 */
		getSample() {
			let $sample = $( `
				<i class="fa fa-cog bg-inserted-icon" aria-hidden="true">
					<span style="display:none;">&nbsp;</span>
				</i>
			` );

			BG.Controls.addStyle( $sample, 'font-size', '36px' );

			return $sample;
		},

		/**
		 * Setup clicking on a panel.
		 *
		 * @since 1.2.7
		 */
		setupPanelClick: function() {
			var controls = BOLDGRID.EDITOR.Controls,
				panel = BOLDGRID.EDITOR.Panel;

			panel.$element.find( '.icon-controls .panel-selection' ).on( 'click', function() {
				var $menu = controls.$menu,
					$target = $menu.targetData[self.name],
					$this = $( this ),
					staticClasses = $target.hasClass( 'fa-li' ) ? 'fa-li' : '';

				$target.removeClass( function( index, css ) {
					return ( css.match( /(^|\s)fa-\S+/g ) || [] ).join( ' ' );
				} );

				$target.addClass( $this.find( 'i' ).attr( 'class' ) + ' ' + staticClasses );
				panel.$element.find( '.selected' ).removeClass( 'selected' );
				$this.addClass( 'selected' );
			} );
		},

		/**
		 * Highlight the icon and set the WordPress link option to popup.
		 *
		 * @since 1.2.7
		 */
		highlightElement: function() {
			var $el = BG.Menu.getTarget( self );
			BOLDGRID.EDITOR.mce.selection.select( $el[0] );
		},

		/**
		 * When the user clicks on the menu item open the panel.
		 *
		 * @since 1.2.7
		 */
		onMenuClick: function() {
			self.openPanel();
		},

		/**
		 * Check if the target is the child of a hover box element.
		 * 
		 * @since 1.25.0
		 * 
		 * @param {JQuery} $target Target Element
		 *
		 * @returns {boolean} True if the target is a hover child.
		 */
		isHoverChild: function( $target ) {
			var $parent = $target.parent();

			// Check if the target is a hover element.
			if ( $parent.hasClass( 'has-hover-bg' ) || $parent.hasClass( 'has-hover-color' ) || $parent.hasClass( 'has-hover-image' )) {
				return true;
			}

			// Check if the target is inside a column that is a hover element.
			if ( 0 !== $parent.closest( 'div[class*="col"].has-hover-bg' ).length 
				|| 0 !== $parent.closest( 'div[class*="col"].has-hover-color' ).length
				|| 0 !== $parent.closest( 'div[class*="col"].has-hover-image' ).length
			) {
				return true;	
			}
			
			// If the target is a row, it's parent will be a container, so ensure it's grandparent is a hover element.
			if ( $target.is( 'div.row' ) && ( 0 !== $parent.parents( '.has-hover-bg' ).length
				|| 0 !== $parent.parents( '.has-hover-color' ).length 
				|| 0 !== $parent.parents( '.has-hover-image' ).length )
			) {
				return true;
			}

			return false;
		},

		/**
		 * Setup the icon search.
		 * 
		 * @since 1.26.1
		 */
		setupIconSearch: function() {
			var $panel       = BG.Panel.$element,
				$searchInput = $panel.find( '.search-input' );

			$searchInput.on( 'keyup', function() {
				var $this  = $( this ),
					$icons = $panel.find( '.icon-controls .panel-selection' );

				$icons.each( function() {
					var $icon     = $( this ),
						iconClass = $icon.find( 'i' ).attr( 'class' );

					if ( iconClass.indexOf( $this.val() ) > -1 ) {
						$icon.show();
					} else {
						$icon.hide();
					}
				} );
			} );
		},

		/**
		 * Open the panel, setting the content.
		 *
		 * @since 1.2.7
		 */
		openPanel: function() {
			var $panel               = BG.Panel.$element,
				$menu                = BG.Controls.$menu,
				$target              = $menu.targetData[self.name],
				hoverVisibilityIndex = this.panel.customizeSupport.indexOf( 'hoverVisibility' ),
				isHoverChild         = false,
				$selected;

			isHoverChild = self.isHoverChild( $target );

			if ( ! isHoverChild && -1 !== hoverVisibilityIndex ) {
				this.panel.customizeSupport.splice( hoverVisibilityIndex, 1 );
			} else if ( isHoverChild && -1 === hoverVisibilityIndex ) {
				this.panel.customizeSupport.push( 'hoverVisibility' );
			}

			self.highlightElement();

			// Create Markup.
			$panel.find( '.panel-body' ).html(
				self.template( {
					presets: BoldgridEditor.icons
				} )
			);

			// Bind Panel Click.
			self.setupPanelClick();

			self.setupIconSearch();

			// Remove Selections.
			$panel.find( '.selected' ).removeClass( 'selected' );

			// Add Selections.
			$selected = $panel
				.find( 'i[class="' + $target.attr( 'class' ) + '"]' )
				.closest( '.panel-selection' )
				.addClass( 'selected' );

			BOLDGRID.EDITOR.Panel.open( self );
		}
	};

	BOLDGRID.EDITOR.CONTROLS.Icon.init();
	self = BOLDGRID.EDITOR.CONTROLS.Icon;
} )( jQuery );
