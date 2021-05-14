import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  List, ListItem, ListItemText, Typography,
  Accordion, AccordionSummary, AccordionDetails, CircularProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
  loader: {
    position: 'relative',
    top: 0,
    left: 'calc(50% - 20px)',
  },
  title: {
    fontSize: 16,
    color: '#000000',
    fontWeight: 'bold',
  },
  listItemRoot: {
    width: '100%',
    flexDirection: 'column',
  },
  listItemText: {
    width: '100%',
    textAlign: 'left',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexShrink: 1,
  },
}));

const Story = () => {
  const classes = useStyles();

  const [storyList, setStoryList] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [storyFetched, setStoryFetched] = useState(false);

  const fetchStoryComments = (story) => {
    if (story.kids && story.kids.length > 0) {
      // Fetching Top 20 Comments
      const commentIds = story.kids.slice(0, 20);
      const stoiresClient = commentIds.map(
        (itemId) => axios.get(`https://hacker-news.firebaseio.com/v0/item/${itemId}.json`),
      );
      Promise.all(stoiresClient)
        .then((results) => {
          // handle success
          const comments = results.map((comment) => comment.data);
          const storyIndex = storyList.findIndex((item) => item.id === story.id);
          if (storyIndex >= 0) {
            const updatedStory = storyList[storyIndex];
            updatedStory.comments = comments;
            setStoryList([...storyList, updatedStory]);
          }
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
    }
  };

  const handleChange = (panel, story) => (event, isExpanded) => {
    if (isExpanded && story.comments.length <= 0) {
      fetchStoryComments(story);
    }
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    // Fetching Top Stories Hacker News API
    const topSoties = new Promise((resolve, reject) => {
      axios.get('https://hacker-news.firebaseio.com/v0/topstories.json')
        .then((response) => {
        // handle success
          resolve(response.data);
        })
        .catch((error) => {
        // handle error
          reject(error);
        });
    });

    topSoties.then((data) => {
      if (data.length > 0) {
        // Fetching Top 10 Stories By Story ID
        const storyIds = data.slice(0, 10);
        const stoiresClient = storyIds.map(
          (itemId) => axios.get(`https://hacker-news.firebaseio.com/v0/item/${itemId}.json`),
        );
        Promise.all(stoiresClient).then((results) => {
          const stories = results.map((story) => {
            const newStory = story.data;
            newStory.comments = [];
            return newStory;
          });
          setStoryList(stories);
          setStoryFetched(true);
        });
      }
    });
  }, []);

  return (
    <div className="Story">
      <Typography className={classes.title}>
        Top Stories snd Comments
      </Typography>
      {!storyFetched
        ? <CircularProgress className={classes.loader} />
        : (
          <List
            component="div"
          >
            {
            storyList.map((story, index) => (
              <ListItem
                component="div"
                key={index.toString()}
                className={classes.listItemRoot}
              >
                <ListItemText
                  className={classes.listItemText}
                  primary={story.title}
                  secondary={`By: ${story.by}`}
                />
                <Accordion
                  className={classes.listItemText}
                  expanded={expanded === `panel-${index.toString()}`}
                  onChange={handleChange(`panel-${index.toString()}`, story)}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel2bh-content-${index.toString()}`}
                    id={`panel2bh-header-${index.toString()}`}
                  >
                    <Typography className={classes.heading}>
                      Comments:-
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {!story.comments.length
                      ? <CircularProgress className={classes.loader} />
                      : (
                        <List
                          component="div"
                        >
                          {
                          story.comments.map((comment, key) => (
                            <ListItem
                              component="div"
                              key={key.toString()}
                              className={classes.listItemRoot}
                            >
                              <ListItemText
                                className={classes.listItemText}
                                primary={(
                                  <span
                                    dangerouslySetInnerHTML={{ __html: comment.text || null }}
                                  />
                                )}
                                secondary={`By: ${comment.by}`}
                              />
                            </ListItem>
                          ))
                        }
                        </List>
                      )}
                  </AccordionDetails>
                </Accordion>
              </ListItem>
            ))
          }
          </List>
        )}
    </div>
  );
};

export default Story;
