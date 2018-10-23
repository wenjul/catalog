import React from "react";
import { catalogShape } from "../CatalogPropTypes";
import PropTypes from "prop-types";
import { css } from "../emotion";
import Frame from "../components/Frame/Frame";
import Hint from "../specimens/Hint";
import Specimen from "../components/Specimen/Specimen";
import HighlightedCode from "../components/HighlightedCode/HighlightedCode";
import ResponsiveTabs from "../components/ResponsiveTabs/ResponsiveTabs";
import runscript from "../utils/runscript";
import validateSizes from "../utils/validateSizes";

const PADDING = 3;
const SIZE = 20;

function getStyle(theme) {
  return {
    container: {
      background: "#fff",
      border: "1px solid #eee",
      borderRadius: "2px",
      boxSizing: "border-box",
      position: "relative",
      flexBasis: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column"
    },
    toggle: {
      border: PADDING + "px solid transparent",
      color: theme.codeColor,
      cursor: "pointer",
      display: "inline-block",
      fontFamily: theme.fontMono,
      fontSize: "16px",
      fontStyle: "normal",
      height: "24px",
      position: "absolute",
      right: -PADDING + "px",
      top: -(SIZE + 3 * PADDING) + "px",
      userSelect: "none",
      ":hover": { color: theme.linkColor }
    },
    source: {
      borderTop: "1px solid #eee",
      boxSizing: "border-box",
      width: "100%",
      height: "auto"
    },
    content: {
      background: `url(${theme.checkerboardPatternLight})`,
      boxSizing: "border-box",
      display: "block",
      padding: 20,
      position: "relative",
      width: "100%",
      height: "100%"
    },
    light: { background: `url(${theme.checkerboardPatternLight})` },
    dark: { background: `url(${theme.checkerboardPatternDark})` },
    plain: { background: "transparent", padding: 0 },
    plain_light: { background: theme.bgLight, padding: "20px" },
    plain_dark: { background: theme.bgDark, padding: "20px" },
    responsive: {
      boxSizing: "border-box",
      overflow: "hidden",
      padding: "15px",
      textAlign: "center"
    }
  };
}

class Html extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewSource: !!props.showSource,
      parentWidth: 0,
      activeScreenSize:
        validateSizes(props.responsive, props.catalog.responsiveSizes)[0] ||
        null
    };
    this.setSize = this.setSize.bind(this);
    this.updateParentWidth = this.updateParentWidth.bind(this);
  }

  componentDidMount() {
    const { runScript } = this.props;
    runScript &&
      Array.from(this.specimen.querySelectorAll("script")).forEach(runscript);

    if (this.state.activeScreenSize) {
      window.addEventListener("resize", this.updateParentWidth);
      setTimeout(this.updateParentWidth);
    }
  }

  componentWillUnmount() {
    if (this.state.activeScreenSize) {
      window.removeEventListener("resize", this.updateParentWidth);
    }
  }

  setElementState(nextState) {
    if (typeof nextState === "function") {
      this.setState(({ elementState }) => ({
        elementState: { ...elementState, ...nextState(elementState) }
      }));
    } else {
      this.setState({
        elementState: { ...this.state.elementState, ...nextState }
      });
    }
  }

  updateParentWidth() {
    if (!this.specimen) {
      return;
    }
    const nextParentWidth = this.specimen.getBoundingClientRect().width - 30;
    if (nextParentWidth !== this.state.parentWidth) {
      this.setState({ parentWidth: nextParentWidth });
    }
  }

  setSize(activeScreenSize) {
    this.setState({ activeScreenSize: activeScreenSize });
  }

  toggleSource() {
    this.setState(({ viewSource }) => ({ viewSource: !viewSource }));
  }

  render() {
    const {
      catalog: { theme, responsiveSizes },
      children,
      frame,
      frameStyles,
      ...options
    } = this.props;
    const { activeScreenSize, parentWidth, viewSource } = this.state;
    const styles = getStyle(theme);
    const validSizes = validateSizes(options.responsive, responsiveSizes);

    const exampleStyles = {
      ...(options.plain ? styles.plain : null),
      ...(options.light ? styles.light : null),
      ...(options.dark ? styles.dark : null),
      ...(options.plain && options.light ? styles.plain_light : null),
      ...(options.plain && options.dark ? styles.plain_dark : null),
      ...(options.responsive ? styles.responsive : null)
    };

    const frameBackground = options.responsive
      ? exampleStyles.background || styles.content.background
      : undefined;
    const exampleBackground = options.responsive
      ? "white"
      : exampleStyles.background || styles.content.background;

    const source = viewSource ? (
      <div className={css(styles.source)}>
        <HighlightedCode language="markup" code={children} theme={theme} />
      </div>
    ) : null;

    const toggle = !options.noSource ? (
      <div className={css(styles.toggle)} onClick={() => this.toggleSource()}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          focusable="false"
          role="presentation"
        >
          <path
            d="M14.155 4.055a1 1 0 0 0-1.271.62l-4.83 14.046a1 1 0 0 0 1.891.65l4.83-14.045a1 1 0 0 0-.62-1.271m-6.138 8.21l-2.58-2.501L8.236 7.05a.999.999 0 1 0-1.392-1.436l-3.54 3.432a1 1 0 0 0 0 1.436l3.32 3.219a1 1 0 1 0 1.393-1.436m12.219 1.568l-3.32-3.22a.999.999 0 1 0-1.393 1.437l2.58 2.5-2.799 2.715a.999.999 0 1 0 1.392 1.436l3.54-3.432a1 1 0 0 0 0-1.436"
            fill="currentColor"
            fillRule="evenodd"
          />
        </svg>
      </div>
    ) : null;

    // eslint-disable-next-line
    const content = <div dangerouslySetInnerHTML={{ __html: children }} />;

    if (options.responsive && !validSizes) {
      return (
        <Hint warning>
          Please check that the responsive parameters match an existing entry.
        </Hint>
      );
    }

    return (
      <div
        className={css(styles.container)}
        ref={el => {
          this.specimen = el;
        }}
      >
        {toggle}
        {options.responsive &&
          parentWidth &&
          activeScreenSize && (
            <ResponsiveTabs
              theme={theme}
              sizes={validSizes}
              action={this.setSize}
              activeSize={activeScreenSize}
              parentWidth={parentWidth}
            />
          )}
        {(!options.responsive || parentWidth) && (
          <div
            className={css({
              ...styles.content,
              ...exampleStyles,
              background: exampleBackground
            })}
          >
            {frame || activeScreenSize ? (
              <Frame
                width={activeScreenSize && activeScreenSize.width}
                parentWidth={parentWidth ? parentWidth : "100%"}
                height={activeScreenSize && activeScreenSize.height}
                scrolling={frame ? false : true}
                background={frameBackground}
                frameStyles={frameStyles}
              >
                {content}
              </Frame>
            ) : (
              content
            )}
          </div>
        )}
        {source}
      </div>
    );
  }
}

Html.propTypes = {
  children: PropTypes.string.isRequired,
  catalog: catalogShape.isRequired,
  responsive: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]),
  runScript: PropTypes.bool,
  plain: PropTypes.bool,
  light: PropTypes.bool,
  dark: PropTypes.bool,
  noSource: PropTypes.bool,
  showSource: PropTypes.bool,
  frame: PropTypes.bool,
  frameStyles: PropTypes.array
};

export default Specimen(undefined, undefined, { withChildren: true })(Html);
