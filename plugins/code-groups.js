'use strict';

function getIcon(type) {
  const langName = type.split(/\s+/g)[0];
  return {
    type: langName,
    icon: `<img src="/img/icon/${langName}.svg" />`
  };
}
const MarkdownItCodeGroup = (md, options = {}) => {
  const {
    classPrefix = "markdown-code-group"
  } = options;
  md.core.ruler.after("block", "code-group", (state) => {
    const tokens = state.tokens;
    let idxFirst = false;
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].content === "::: code-group-open" && tokens[i].type === "inline") {
        const open = tokens[i];
        const startIndex = i;
        while (tokens[i]?.content !== "::: code-group-close" && i <= tokens.length) {
          i += 1;
          if (tokens[i]?.tag === "p")
            tokens[i].hidden = true;
          if (!idxFirst && tokens[i]?.tag === "code") {
            const { type } = getIcon(tokens[i].info);
            tokens[i].attrs = [["class", `code-group-content-${type} active`]];
            idxFirst = true;
          } 
          if (tokens[i]?.tag === "code") {
            const { type } = getIcon(tokens[i].info);
            if (tokens[i].info === 'bash') {
              tokens[i].attrs = [["class", `code-group-content-${type}`]];
            } else {
              tokens[i].attrs = [["class", `code-group-content-${type}`], ['style', 'display: none']];
            }
          }
        }
        const close = tokens[i];
        const endIndex = i;
        const codeGroupContent = tokens.slice(startIndex, endIndex + 1).filter((v) => v.tag === "code");
        const tabs = codeGroupContent.map((v, idx) => {
          const { icon, type } = getIcon(v.info);
          if (idx === 0) {
            return `<div class="markdown-group-tab-item active" data-code-group="${type}">${icon}
            </div>`;
          } else {
            return `<div class="markdown-group-tab-item" data-code-group="${type}">${icon}
            </div>`;
          }
        }).join("");
        open.type = "code_group_open";
        open.tag = "div";
        open.meta = {
          contentTab: tabs
        };
        close.type = "code_group_close";
        close.tag = "div";
      }
    }
  });
  md.renderer.rules.code_group_open = function(tokens, idx) {
    const { contentTab } = tokens[idx].meta;
    if (contentTab) {
      return `<div class="${classPrefix}">
        <div class="markdown-group-tab">
          ${contentTab}
        </div>
        `;
    }
    return "";
  };
  md.renderer.rules.code_group_close = function() {
    return "</div>";
  };
};

module.exports = MarkdownItCodeGroup;