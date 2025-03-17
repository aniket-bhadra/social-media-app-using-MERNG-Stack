function getAnonymousUsername(username) {
  const words1 = [
    "Fierce",
    "Stealthy",
    "Silent",
    "Majestic",
    "Shadow",
    "Enigmatic",
    "Wild",
    "Masked",
    "Swift",
    "Joyful",
    "Fearless",
  ];

  const animals = [
    "Wolf",
    "Falcon",
    "Tiger",
    "Eagle",
    "Panther",
    "Fox",
    "Bear",
    "Hawk",
    "Lion",
    "Penguin",
    "Cheetah",
  ];

  const avatars = [
    "https://cdn.pixabay.com/photo/2013/07/13/14/02/wolf-161987_1280.png",
    "https://cdn.pixabay.com/photo/2017/03/30/13/15/falcon-2188381_1280.png",
    "https://cdn.pixabay.com/photo/2022/01/05/23/08/tiger-6918246_1280.png",
    "https://cdn.pixabay.com/photo/2020/12/02/18/08/eagle-5798326_1280.png",
    "https://cdn.pixabay.com/photo/2018/04/13/11/56/panther-3316354_1280.png",
    "https://cdn.pixabay.com/photo/2016/03/31/18/26/angry-1294363_1280.png",
    "https://cdn.pixabay.com/photo/2012/05/07/11/48/brown-48198_1280.png",
    "https://cdn.pixabay.com/photo/2012/05/02/17/54/hawk-45834_1280.png",
    "https://cdn.pixabay.com/photo/2018/04/20/12/18/lion-3335859_1280.png",
    "https://cdn.pixabay.com/photo/2016/03/31/19/57/avatar-1295406_1280.png",
    "https://cdn.pixabay.com/photo/2024/10/21/17/43/cheetah-9137904_1280.png",
  ];

  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash += username.charCodeAt(i);
  }

  const index = hash % animals.length;

  return {
    anonymousUsername: `${words1[index]} ${animals[index]}`,
    avatar: avatars[index],
  };
}

export default getAnonymousUsername;
