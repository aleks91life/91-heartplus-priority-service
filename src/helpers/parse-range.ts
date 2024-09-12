function parseRange(range: string): any {
  if (range) {
    const rangeParts = range.split("-");
    let page = 1;
    let perPage = 10;
    if (
      rangeParts.length === 2 &&
      Number.parseInt(rangeParts[0]) &&
      Number.parseInt(rangeParts[1])
    ) {
      const start = Number.parseInt(rangeParts[0]);
      const end = Number.parseInt(rangeParts[1]);
      if (start <= end) {
        page = start;
        perPage = end - start + 1;
      }

      return {
        page,
        perPage,
      };
    }
  }
}

export { parseRange };
