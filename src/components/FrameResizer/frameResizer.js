import React from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { catalogShape } from "../../CatalogPropTypes";
// import { css } from "../../emotion";
import { iframeResizer as iframeResizerLib } from "iframe-resizer";

class IframeResizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.updateIframe = this.updateIframe.bind(this);
    this.injectIframeResizerUrl = this.injectIframeResizerUrl.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.resizeIframe = this.resizeIframe.bind(this);
  }

  componentDidMount() {
    // can't update until we have a mounted iframe
    this.updateIframe(this.props);
    this.resizeIframe(this.props);
  }
  // UNSAFE_componentWillReceiveProps(nextProps) {
  //   // can replace content if we got new props
  //   this.updateIframe(nextProps);
  //   this.resizeIframe(nextProps);
  // }

  updateIframe(props) {
    const {
      catalog: { iframeGlobalStyles },
      catalog: {
        page: { iframePageStyles }
      },
      catalog: { iframeGlobalScripts },
      catalog: {
        page: { iframePageScripts }
      }
    } = this.context;

    // has src - no injected content
    if (props.src) return;
    // do we have content to inject (content or children)
    const content = props.content || props.children;
    if (!content) return;
    // get frame to inject into
    const frame = this.frame;
    if (!frame) return;
    // verify frame document access
    // Due to browser security, this will fail with the following error
    //   Uncaught DOMException: Failed to read the 'contentDocument' property from 'HTMLIFrameElement':
    //   Blocked a frame with origin "http://<hostname>" from accessing a cross-origin frame.
    // resolve this by loading documents from the same domain name,
    // or injecting HTML `content` vs. loading via `src`
    const doc = frame.contentDocument;
    if (!doc) return;
    // replace iframe document content
    if (typeof content === "string") {
      // assume this is a HTML block
      //   we could send this in via REACT dangerously set HTML
      //   but we are in an iframe anyway, already a red-headed step-child.
      doc.open();
      doc.write(content);
      doc.close();
    } else {
      // assume this is a REACT component
      doc.open();
      doc.write('<div id="iframe-root" data-iframe-height></div>');
      doc.close();
      ReactDOM.render(content, doc.getElementById("iframe-root"));
    }
    //插入样式
    const allIframeStyles = Array.prototype.concat(
      iframeGlobalStyles,
      iframePageStyles,
      this.props.frameStyles
    );
    allIframeStyles.forEach(link => {
      if (link != undefined) {
        const linkTag = doc.createElement("link");
        linkTag.setAttribute("rel", "stylesheet");
        linkTag.setAttribute("href", link);
        doc.head.appendChild(linkTag);
      }
    });
    // 插入脚本
    const allIframeScripts = Array.prototype.concat(
      iframeGlobalScripts,
      iframePageScripts,
      this.props.frameScripts
    );
    allIframeScripts.forEach(script => {
      if (script != undefined) {
        const scriptTag = doc.createElement("script");
        scriptTag.setAttribute("src", script);
        doc.body.appendChild(scriptTag);
      }
    });
  }
  // inject the iframe resizer "content window" script
  injectIframeResizerUrl() {
    if (!this.props.iframeResizerUrl) return;
    const frame = this.frame;
    if (!frame) return;
    // verify frame document access
    // Due to browser security, this will fail with the following error
    //   Uncaught DOMException: Failed to read the 'contentDocument' property from 'HTMLIFrameElement':
    //   Blocked a frame with origin "http://<hostname>" from accessing a cross-origin frame.
    // resolve this by loading documents from the same domain name,
    // or injecting HTML `content` vs. loading via `src`
    const doc = frame.contentDocument;
    if (!doc) return;
    // where can we insert into? (fail into whatever we can find)
    let injectTarget = null;
    ["body", "BODY", "head", "HEAD", "div", "DIV"].forEach(tagName => {
      if (injectTarget) return;
      const found = doc.getElementsByTagName(tagName);
      if (!(found && found.length)) return;
      injectTarget = found[0];
    });
    if (!injectTarget) {
      // eslint-disable-next-line no-console
      console.error("Unable to inject iframe resizer script");
      return;
    }
    const resizerScriptElement = document.createElement("script");
    resizerScriptElement.src = this.props.iframeResizerUrl;
    injectTarget.appendChild(resizerScriptElement);

    const customOptionsElement = document.createElement("script");
    customOptionsElement.text = ` 
    window.iFrameResizer = {
     heightCalculationMethod: function(){
       const iframeWrap = document.querySelector('div[data-iframe-height]');
       if(iframeWrap){
         return iframeWrap.scrollHeight;
       }
     }
    }`;
    injectTarget.appendChild(customOptionsElement);
  }
  onLoad() {
    this.injectIframeResizerUrl();
    // DISABLED because it's causing a loading loop :(
    // if (this.props.onIframeLoaded) this.props.onIframeLoaded();
  }
  resizeIframe(props) {
    const frame = this.frame;
    if (!frame) return;
    if (props.iframeResizerEnable) {
      iframeResizerLib(props.iframeResizerOptions, frame);
    }
  }

  render() {
    const { src, id, frameBorder, className, style } = this.props;

    return (
      <iframe
        ref={node => (this.frame = node)}
        src={src}
        id={id}
        frameBorder={frameBorder}
        className={className}
        style={style}
        onLoad={this.onLoad}
      />
    );
  }
}
IframeResizer.propTypes = {
  // iframe content/document
  // option 1. content of HTML to load in the iframe
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  // option 2. src to a URL to load in the iframe
  src: PropTypes.string,
  // iframe-resizer controls and helpers
  iframeResizerEnable: PropTypes.bool,
  iframeResizerOptions: PropTypes.object,
  iframeResizerUrl: PropTypes.oneOfType([
    PropTypes.string, // URL to inject
    PropTypes.bool // false = disable inject
  ]),
  // misc props to pass through to iframe
  id: PropTypes.string,
  frameBorder: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object,
  // optional extra callback when iframe is loaded
  // onIframeLoaded: PropTypes.func,
  frameStyles: PropTypes.array,
  frameScripts: PropTypes.array
};
IframeResizer.defaultProps = {
  // resize iframe
  iframeResizerEnable: true,
  iframeResizerOptions: {
    // log: true,
    autoResize: true,
    checkOrigin: false,
    // resizeFrom: "parent"
    heightCalculationMethod: "taggedElement"
    // initCallback: () => { console.log('ready!'); },
    // resizedCallback: () => { console.log('resized!'); },
  },
  iframeResizerUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/3.6.3/iframeResizer.contentWindow.min.js",
  // misc props to pass through to iframe
  frameBorder: 0,
  style: {
    width: "100%"
    // minHeight: 20,
  },
  frameStyles: [],
  frameScripts: []
};

IframeResizer.contextTypes = {
  catalog: catalogShape.isRequired
};

export default IframeResizer;
