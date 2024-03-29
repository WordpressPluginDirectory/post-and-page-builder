window.BOLDGRID = window.BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.VALIDATION = BOLDGRID.EDITOR.VALIDATION || {};

( function( $ ) {
	'use strict';

	BOLDGRID.EDITOR.VALIDATION.Section = {};
	let self = BOLDGRID.EDITOR.VALIDATION.Section;

	/**
	 * Get the closest element within context.
	 *
	 * @since 1.2.7
	 */
	$.fn.closestContext = function( sel, context ) {
		var $closest;
		if ( this.is( sel ) ) {
			$closest = this;
		} else {
			$closest = this.parentsUntil( context )
				.filter( sel )
				.eq( 0 );
		}

		return $closest;
	};

	let defaultContainerClass = 'container',
		sectionClass = 'boldgrid-section',
		section = '<div class="' + sectionClass + '"></div>',
		container = '<div class="' + defaultContainerClass + '"></div>';

	/**
	 * Find all top level content elements that are siblings and not in rows and wrap them.
	 *
	 * @since 1.2.7
	 */
	let wrapElementGroup = function() {
		var wrap,
			group = [],
			contentSelector = [
				'h1',
				'h2',
				'h3',
				'h4',
				'h5',
				'h6',
				'h7',
				'a',
				'img',
				'p',
				'button:not(.nav-link)',
				'ul:not(.nav-tabs)',
				'ol',
				'dl',
				'form',
				'table',
				'[data-imhwpb-draggable="true"]',
				'.wpview-wrap',
				'.wpview',
				'blockquote',
				'code',
				'abbr'
			].join( ',' );

		wrap = function() {
			$( group ).wrapAll(
				'<div class="' +
					defaultContainerClass +
					'"><div class="row"><div class="col-lg-12 col-md-12">'
			);
			group = [];
		};

		self.$context.find( '> *' ).each( function() {
			var $this = $( this );

			// Do not wrap next page marker or tinyMCE bookmarks.
			if (
				$this.is( contentSelector ) &&
				! $this.find( '.mce-wp-nextpage' ).length &&
				! $this.find( '.mce_SELRES_start' ).length
			) {
				group.push( this );
			} else {
				wrap();
			}
		} );

		wrap();
	};

	/**
	 * Find all content elements that are not in columns and wrap them.
	 * 
	 * @since 1.25.1
	 */
	let wrapUncolumnedElements = function() {
		var wrap,
			group = [],
			contentSelector = [
				'p',
				'h1',
				'h2',
				'h3',
				'h4',
				'h5',
				'h6',
				'h7'
			].join( ',' );

		wrap = function() {
			$( group ).each( ( _, el ) => {
				$( el ).wrap( '<div class="col-lg-12 col-md-12 col-xs-12 col-sm-12"></div>' );
				$( el ).removeAttr( 'class' );
				let contents = $( el ).find( 'p' ).text();
				$( el ).html( contents );
			} );
			group = [];
		};

		self.$context.find( 'div.row > *' ).each( function() {
			var $this = $( this );
			// Do not wrap next page marker or tinyMCE bookmarks.
			if (
				$this.is( contentSelector ) &&
				! $this.find( '.mce-wp-nextpage' ).length &&
				! $this.find( '.mce_SELRES_start' ).length
			) {
				group.push( this );
			} else {
				wrap();
			}
		} );

		wrap();
	};

	/**
	 * Update content within context.
	 *
	 * @since 1.2.7
	 * @param $context.
	 */
	self.updateContent = function( $context ) {
		defaultContainerClass = BoldgridEditor.default_container || 'container';
		container = '<div class="' + defaultContainerClass + '"></div>';

		self.$context = $context;

		// Wrap sibling content elements not in rows, into rows.
		wrapElementGroup();

		// Wrap content elements not in columns, into columns.
		wrapUncolumnedElements();

		// Add Class boldgrid-section to all parent of containers.
		addSectionClass();

		// Wrap all containers in sections.
		wrapContainers();

		// If row has a parent add the section to the parent.
		addContainers();
		copyClasses();
	};

	/**
	 * Update all containers with a context to the default container.
	 *
	 * @since 1.6
	 *
	 * @param  {jQuery} $context Jquery element(s).
	 */
	self.updateContainers = function( $context ) {
		$context.find( ' .container, .container-fluid' ).each( function() {
			$( this )
				.removeClass( 'container container-fluid' )
				.addClass( BoldgridEditor.default_container );
		} );
	};

	/**
	 * Copy classes from container-fluid onto section.
	 *
	 * @since 1.2.7
	 */
	let copyClasses = function() {
		self.$context.find( '.boldgrid-section > .container-fluid' ).each( function() {
			var $this = $( this ),
				classToAdd = $this.attr( 'class' ).replace( 'container-fluid', '' );

			$this.attr( 'class', 'container-fluid' );
			$this.parent().addClass( classToAdd );
		} );
	};

	/**
	 * Add section class to container parents.
	 *
	 * @since 1.2.7
	 */
	let addSectionClass = function() {
		self.$context.find( '.container' ).each( function() {
			var $this = $( this ),
				$parent = $this.parent();

			if (
				$parent.length &&
				$parent[0] !== self.$context[0] &&
				false === $parent.hasClass( sectionClass )
			) {
				$parent.addClass( sectionClass );
			}
		} );
	};

	/**
	 * Wrap top level rows in containers.
	 *
	 * @since 1.2.7
	 */
	let addContainers = function() {
		self.$context.find( '.row:not(.row .row)' ).each( function() {
			var $this = $( this ),
				$parent = $this.parent();

			if ( ! $this.closestContext( '.container, .container-fluid', self.$context ).length ) {
				$this.wrap( container );
			}

			if ( ! $this.closestContext( '.boldgrid-section', self.$context ).length ) {
				if ( $parent.length && $parent[0] !== self.$context[0] ) {
					$parent.addClass( sectionClass );
				} else {
					$this.parent().wrap( section );
				}
			}
		} );
	};

	/**
	 * Wrap containers in sections.
	 *
	 * @since 1.2.7
	 */
	let wrapContainers = function() {
		self.$context.find( '.container, .container-fluid' ).each( function() {
			var $this = $( this );

			if ( ! $this.parent( '.boldgrid-section' ).length && false === $this.hasClass( sectionClass ) ) {
				$this.wrap( section );
			}
		} );
	};
} )( jQuery );
