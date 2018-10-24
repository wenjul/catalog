import React from "react";
import { catalogShape } from "../CatalogPropTypes";
import { text } from "../styles/typography";
import PropTypes from "prop-types";
import { css } from "../emotion";
import Specimen from "../components/Specimen/Specimen";
import mapSpecimenOption from "../utils/mapSpecimenOption";
import HighlightedCode from "../components/HighlightedCode/HighlightedCode";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Tooltip from "@material-ui/core/Tooltip";

// import { relative } from "path";
// import { isAbsolute } from "upath";

function getStyle(theme) {
  return {
    container: {
      ...text(theme, -0.5),
      boxSizing: "border-box",
      display: "block",
      width: "100%",
      background: "#fff",
      border: "1px solid #eee",
      color: theme.textColor,
      fontFamily: theme.fontMono,
      fontWeight: 400,
      postion: "relative"
    },
    toggle: {
      textDecoration: "underline",
      cursor: "pointer",
      marginBottom: 0,
      padding: 20,
      WebkitUserSelect: "none",
      userSelect: "none",
      background: "#eee"
    },
    copyCode: { position: "absolute", top: 20, right: 20, cursor: "pointer" },
    copyIcon: { fill: "#818a91", ":hover": { fill: theme.brandColor } }
  };
}

class Code extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewSource: props.collapsed ? false : true,
      copied: false,
      tooltipOpen: false
    };
    this.handleTooltipClose = this.handleTooltipClose.bind(this);
    this.handleTooltipOpen = this.handleTooltipOpen.bind(this);
  }

  handleTooltipClose() {
    this.setState({ tooltipOpen: false, copied: false });
  }

  handleTooltipOpen() {
    this.setState({ tooltipOpen: true });
  }

  render() {
    const {
      catalog: { theme },
      children,
      rawBody,
      collapsed,
      lang,
      raw
    } = this.props;
    const { viewSource } = this.state;
    const styles = getStyle(theme);

    // console.log(rawBody);

    const toggle = collapsed ? (
      <div
        className={css(styles.toggle)}
        onClick={() => this.setState({ viewSource: !viewSource })}
      >
        {viewSource ? "close" : "show example code"}
      </div>
    ) : null;

    const content = viewSource ? (
      <HighlightedCode
        language={lang}
        code={raw ? rawBody : children}
        theme={theme}
      />
    ) : null;

    return (
      <section className={css(styles.container)}>
        {toggle}
        {content}
        <div className={css(styles.copyCode)}>
          <CopyToClipboard
            text={raw ? rawBody : children}
            onCopy={() =>
              this.setState({
                copied: true
              })
            }
          >
            <Tooltip
              placement="top"
              title={!this.state.copied ? "Copy" : "Copied"}
              onClose={this.handleTooltipClose}
              onOpen={this.handleTooltipOpen}
              open={this.state.tooltipOpen}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                className={css(styles.copyIcon)}
              >
                <path fill="none" d="M0 0h24v24H0V0z" />
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm-1 4H8c-1.1 0-1.99.9-1.99 2L6 21c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V11l-6-6zM8 21V7h6v5h5v9H8z" />
              </svg>
            </Tooltip>
          </CopyToClipboard>
        </div>
      </section>
    );
  }
}

Code.propTypes = {
  children: PropTypes.string.isRequired,
  rawBody: PropTypes.string.isRequired,
  catalog: catalogShape.isRequired,
  collapsed: PropTypes.bool,
  lang: PropTypes.string,
  raw: PropTypes.bool
};

const mapOptionsToProps = mapSpecimenOption(/^lang-(\w+)$/, lang => ({ lang }));

const mapBodyToProps = (parsed, rawBody) => ({ ...parsed, rawBody });

export default Specimen(mapBodyToProps, mapOptionsToProps, {
  withChildren: true
})(Code);
