import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter
 } from 'react-router-dom';
import { formatDate, formatTweet } from '../utils/helpers';
import { TiArrowBackOutline, TiHeartOutline, TiHeartFullOutline } from 'react-icons/ti'
import { handleToggleTweet  } from '../actions/tweets';


class Tweet extends Component {
    handleLike = e => {
        e.preventDefault();

        const { dispatch, tweet, authedUser } = this.props;
        dispatch(handleToggleTweet({
            id: tweet.id,
            hasLiked: tweet.hasLiked,
            authedUser
        }))
    }

    toParent = (e,id) => {
        e.preventDefault();
        // Todo: redirect to parent tweet
        this.props.history.push(`/tweet/${id}`)
    }

    render() {
        const { tweet } = this.props;

        if(!tweet) return <p>Tweet does'nt exist</p>

        const { name, avatar, timestamp, hasLiked, likes, text, replies, id, parent } = tweet;
        return (
            <Link className="tweet" to={`/tweet/${id}`}>
                <img
                    src={ avatar }
                    alt={`avatar of ${name}`}
                    className="avatar"
                />
                <div className="tweet-info">
                    <span>{name}</span>
                    <div>{formatDate(timestamp)}</div>
                    { parent && (
                        <button className="replying-to" onClick={ e => this.toParent(e, parent.id)}>
                            Replying to @{parent.author}
                        </button>
                    )}
                    <p>{ text }</p>
                
                    <div className="tweet-icons">
                        <TiArrowBackOutline className="tweet-icon" />
                        <span>{ replies && replies }</span>
                        <button className="heart-button" onClick={ this.handleLike }>
                            {
                                hasLiked ? <TiHeartFullOutline className="tweet-icon" color="#e0245e" /> : <TiHeartOutline className="tweet-icon" />
                            }
                        </button>
                        <span>{ likes && likes }</span>
                    </div>
                </div>
            </Link>
        )
    }
}

function mapStateToProps (state, { id }) {
    const { authedUser, users, tweets } = state;
    const tweet = tweets[id];
    const parentTweet = tweet ? tweets[tweet.replyingTo] : null;
    return {
      authedUser,
      tweet: (Object.keys(users).length && tweet) ? formatTweet(tweet, users[tweet.author], authedUser, parentTweet) : null
    };
  }

export default withRouter(connect(mapStateToProps)(Tweet));