twttr.widgets.createTimeline(
    {
      sourceType: "profile",
      screenName: "Gunzeroni"
    },
    document.getElementById("container"),
    {
      height: 400,
      chrome: "nofooter",
      tweetLimit: 2
    }
  );