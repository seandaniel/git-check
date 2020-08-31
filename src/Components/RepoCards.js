import React from 'react';
import Moment from 'react-moment';

const RepoCards = ({ node_id, html_url, name, description, language, created_at }) => {
  return (
    <div className="repo-card" key={node_id}>
      <a href={html_url}>{name}</a>
      <p className="description">{description}</p>
      <div className="language-date-container">
        <p>{language}</p>
        <p><Moment format="MMMM DD, YYYY">{created_at}</Moment></p>
      </div>
    </div>
  )
}

export default RepoCards;
