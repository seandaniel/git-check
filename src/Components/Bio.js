import React from 'react';
import Moment from 'react-moment';
import { FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';

const Bio = ({ user_id, avatar_url, name, html_url, login, location, created_at, public_repos, blog }) => {
  return (
    <div className="bio-container" key={user_id}>
      <img src={avatar_url} alt={name} />
      <h2>{name}</h2>
      <a title="View GitHub profile" href={html_url} target="_blank" rel="noopener noreferrer">@{login}</a>
      <div className="location-joined-repo-container">
        <div className="location-joined-container">
          {
            // if location is null, set it to Planet Earth
            !location
              ? <p><FaMapMarkerAlt /> Planet Earth</p>
              : <p><FaMapMarkerAlt /> {location}</p>
          }
          <p><FaCalendarAlt />Joined <Moment format="MMMM DD, YYYY">{created_at}</Moment></p>
        </div>
        {
          // if user has 1 repo, set span text to repo
          public_repos === 1
            ? <p className="repos"><span>{public_repos}</span><span>Repo</span></p>
            : <p className="repos"><span>{public_repos}</span><span>Repos</span></p>
        }
      </div>
      {
        // if blog doesn't have http, add https to href
        // remove https and http from <a> text
        !blog.includes('http')
          ? <a href={`https://${blog}`} target="_blank" rel="noopener noreferrer" title="View personal website">{blog}</a>
          : blog.includes('https://')
            ? <a href={`${blog}`} target="_blank" rel="noopener noreferrer" title="View personal website">{blog.slice(8)}</a>
            : <a href={`${blog}`} target="_blank" rel="noopener noreferrer" title="View personal website">{blog.slice(7)}</a>
      }
    </div>
  )
}

export default Bio;
