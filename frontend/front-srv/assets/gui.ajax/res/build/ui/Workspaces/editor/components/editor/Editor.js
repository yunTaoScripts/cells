/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

// IMPORT
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _pydio = require('pydio');

var _pydio2 = _interopRequireDefault(_pydio);

//import FullScreen from 'react-fullscreen';

var _reactDraggable = require('react-draggable');

var _reactDraggable2 = _interopRequireDefault(_reactDraggable);

var _reactRedux = require('react-redux');

var _materialUi = require('material-ui');

var _EditorTab = require('./EditorTab');

var _EditorTab2 = _interopRequireDefault(_EditorTab);

var _EditorToolbar = require('./EditorToolbar');

var _EditorToolbar2 = _interopRequireDefault(_EditorToolbar);

var _makeMinimise = require('./make-minimise');

var _makeMinimise2 = _interopRequireDefault(_makeMinimise);

var _Pydio$requireLib = _pydio2['default'].requireLib('hoc');

var EditorActions = _Pydio$requireLib.EditorActions;

var MAX_ITEMS = 4;

// MAIN COMPONENT

var Editor = (function (_React$Component) {
    _inherits(Editor, _React$Component);

    function Editor(props) {
        var _this = this;

        _classCallCheck(this, Editor);

        _React$Component.call(this, props);

        var tabDelete = props.tabDelete;
        var tabDeleteAll = props.tabDeleteAll;
        var editorModify = props.editorModify;
        var editorSetActiveTab = props.editorSetActiveTab;

        this.state = {
            minimisable: false
        };

        this.minimise = function () {
            return editorModify({ isPanelActive: false });
        };
        this.setFullScreen = function () {
            return editorModify({ fullscreen: typeof (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) !== 'undefined' });
        };

        this.closeActiveTab = function (e) {
            var activeTab = _this.props.activeTab;

            editorSetActiveTab(null);
            tabDelete(activeTab.id);
        };

        this.close = function (e) {
            editorModify({ open: false });
            tabDeleteAll();
        };

        // By default, open it up
        editorModify({ isPanelActive: true });
    }

    Editor.prototype.componentDidMount = function componentDidMount() {
        DOMUtils.observeWindowResize(this.setFullScreen);
    };

    Editor.prototype.componentWillUnmount = function componentWillUnmount() {
        DOMUtils.stopObservingWindowResize(this.setFullScreen);
    };

    Editor.prototype.enterFullScreen = function enterFullScreen() {
        if (this.props.onFullBrowserScreen) {
            this.props.onFullBrowserScreen();
            return;
        }

        if (this.container.requestFullscreen) {
            this.container.requestFullscreen();
        } else if (this.container.mozRequestFullScreen) {
            this.container.mozRequestFullScreen();
        } else if (this.container.webkitRequestFullscreen) {
            this.container.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    };

    Editor.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {

        if (this.state.minimisable) return;

        var translated = nextProps.translated;

        if (!translated) return;

        this.recalculate();

        this.setState({ minimisable: true });
    };

    Editor.prototype.recalculate = function recalculate() {
        var editorModify = this.props.editorModify;

        if (!this.container) return;

        editorModify({
            panel: {
                rect: this.container.getBoundingClientRect()
            }
        });
    };

    Editor.prototype.renderChild = function renderChild() {
        var _props = this.props;
        var activeTab = _props.activeTab;
        var tabs = _props.tabs;
        var editorSetActiveTab = _props.editorSetActiveTab;

        var filteredTabs = tabs.filter(function (_ref) {
            var editorData = _ref.editorData;
            return editorData;
        });

        return filteredTabs.map(function (tab, index) {
            var style = {
                display: "flex",
                width: 100 / MAX_ITEMS + "%",
                height: "40%",
                margin: "10px",
                overflow: "scroll",
                whiteSpace: "nowrap"
            };

            if (filteredTabs.length > MAX_ITEMS) {
                if (index < MAX_ITEMS) {
                    style.flex = 1;
                } else {
                    style.flex = 0;
                    style.margin = 0;
                }
            }

            if (activeTab) {
                if (tab.id === activeTab.id) {
                    style.margin = 0;
                    style.flex = 1;
                } else {
                    style.flex = 0;
                    style.margin = 0;
                }
            }

            return React.createElement(_EditorTab2['default'], { key: 'editortab' + tab.id, id: tab.id, style: _extends({}, style) });
        });
    };

    Editor.prototype.render = function render() {
        var _this2 = this;

        var _props2 = this.props;
        var style = _props2.style;
        var activeTab = _props2.activeTab;
        var isActive = _props2.isActive;
        var displayToolbar = _props2.displayToolbar;
        var minimisable = this.state.minimisable;

        var title = activeTab ? activeTab.title : "";
        var onClose = activeTab ? this.closeActiveTab : this.close;
        var onMinimise = minimisable ? this.minimise : null;
        var onMaximise = this.maximise;

        var parentStyle = {
            display: "flex",
            flex: 1,
            overflow: "hidden",
            width: "100%",
            height: "100%",
            position: "relative"
        };

        if (!activeTab) {
            parentStyle = _extends({}, parentStyle, {
                alignItems: "center", // To fix a bug in Safari, we only set it when height not = 100% (aka when there is no active tab)
                justifyContent: "center"
            });
        }

        return React.createElement(
            'div',
            { style: _extends({ display: "flex" }, style) },
            React.createElement(
                AnimatedPaper,
                { ref: function (container) {
                        return _this2.container = ReactDOM.findDOMNode(container);
                    }, onMinimise: this.props.onMinimise, minimised: !isActive, zDepth: 5, style: { display: "flex", flexDirection: "column", overflow: "hidden", width: "100%", height: "100%", transformOrigin: style.transformOrigin } },
                displayToolbar && React.createElement(_EditorToolbar2['default'], { style: { flexShrink: 0 }, title: title, onClose: onClose, onFullScreen: function () {
                        return _this2.enterFullScreen();
                    }, onMinimise: onMinimise }),
                React.createElement(
                    'div',
                    { className: 'body', style: parentStyle },
                    this.renderChild()
                )
            )
        );
    };

    return Editor;
})(React.Component);

;

// ANIMATIONS
var AnimatedPaper = _makeMinimise2['default'](_materialUi.Paper);

// REDUX - Then connect the redux store
function mapStateToProps(state, ownProps) {
    var editor = state.editor;
    var tabs = state.tabs;

    var activeTab = tabs.filter(function (tab) {
        return tab.id === editor.activeTabId;
    })[0];

    return _extends({
        style: {},
        displayToolbar: !editor.fullscreen
    }, ownProps, {
        activeTab: activeTab,
        tabs: tabs,
        isActive: editor.isPanelActive
    });
}
var ConnectedEditor = _reactRedux.connect(mapStateToProps, EditorActions)(Editor);

// EXPORT
exports['default'] = ConnectedEditor;
module.exports = exports['default'];