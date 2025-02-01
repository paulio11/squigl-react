import { Link } from "react-router-dom";
import Hashtag from "../components/Hashtag/Hashtag";

export const createTags = (inputText) => {
  const regex = /(https?:\/\/[^\s]+|#\w+|@\w+)/g;
  const parts = inputText.split(regex);

  return parts.map((part, i) => {
    if (regex.test(part)) {
      if (part.startsWith("#")) {
        return <Hashtag key={i} tag={part} />;
      } else if (part.startsWith("@")) {
        const linkPath = `/u/${part.slice(1)}`;
        return (
          <Link key={i} to={linkPath} className="usertag">
            {part}
          </Link>
        );
      } else if (part.startsWith("http")) {
        return (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer">
            {part}
          </a>
        );
      }
    }
    return part; // Return plain text for non-matching parts
  });
};
