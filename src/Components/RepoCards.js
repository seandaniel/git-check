import React from 'react';
import Moment from 'react-moment';

const RepoCards = ({ node_id, html_url, name, description, language, created_at }) => {
  return (
    <div className="repo-card" key={node_id}>
      <h4><a title="View repository" href={html_url} target="_blank" rel="noopener noreferrer">{name}</a></h4>
      <p className="description">{description}</p>
      <div className="language-date-container">
        <p>{language}</p>
        <p><Moment format="MMMM DD, YYYY">{created_at}</Moment></p>
      </div>
    </div>
  )
}

export default RepoCards;
