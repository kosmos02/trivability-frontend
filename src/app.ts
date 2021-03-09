var entities: any = {
    amp: "&",
    apos: "'",
    "#x27": "'",
    "#x2F": "/",
    "#039": "'",
    "#47": "/",
    lt: "<",
    gt: ">",
    nbsp: " ",
    quot: '"',
  };
  export const decodeHTMLEntities = (text: any) => {
    return text.replace(/&([^;]+);/gm, function (match: any, entity: any) {
      return entities[entity] || match;
    });
  }