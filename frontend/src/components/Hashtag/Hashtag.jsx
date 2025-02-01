import React from "react";
import { Link } from "react-router-dom";

import { useSearch } from "../../contexts/SearchContext";

const Hashtag = ({ tag }) => {
  const { setSearchQuery } = useSearch();

  return (
    <Link
      to={`/s/${tag.slice(1)}`}
      className="hashtag"
      onClick={() => setSearchQuery(tag)}
    >
      {tag}
    </Link>
  );
};

export default Hashtag;
