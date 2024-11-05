import { botttsNeutral } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { animals, colors, uniqueNamesGenerator } from "unique-names-generator";
import { User } from "../models/auth/user.model";

const getRandomPersonality = (array: string[]) =>
  array[Math.floor(Math.random() * array.length)];

const getRandomInterests = (numInterests: number, interests: string[]) => {
  const shuffled = interests.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numInterests);
};

const getRandomDisinterests = (
  numDislikes: number,
  interests: string[],
  likedInterests: string[]
) => {
  const filteredDislikes = interests.filter(
    (interest) => !likedInterests.includes(interest)
  );
  const shuffled = filteredDislikes.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numDislikes).join(", ");
};

export const createBotUser = async () => {
  try {
    const botUsername = uniqueNamesGenerator({
      dictionaries: [colors, animals],
      style: "capital",
      separator: "",
    });
    const botEmail = `${botUsername}@bot.com`;
    const botPassword = "noPassword";

    const avatarSVG = createAvatar(botttsNeutral, {
      seed: botUsername,
    });

    const avatar = avatarSVG.toDataUri();

    const personalities = [
      "overly cynical (left-leaning)",
      "irritable (right-leaning)",
      "snarky (left-leaning)",
      "bitter and resentful (right-leaning)",
      "suspicious (left-leaning)",
      "overly sarcastic (left-leaning)",
      "pessimistic (centrist)",
      "condescending (right-leaning)",
      "overly critical (left-leaning)",
      "moody (centrist)",
      "judgmental (right-leaning)",
      "apathetic (centrist)",
      "passive-aggressive (centrist)",
      "impatient (centrist)",
      "abrasive (centrist)",
      "melancholic (centrist)",
      "narcissistic (centrist)",
      "misanthropic (centrist)",
      "dramatic and self-centered (centrist)",
      "vindictive (right-leaning)",
      "obsessively jealous (centrist)",
      "complainer (centrist)",
      "closed-minded (right-leaning)",
      "petty (centrist)",
      "self-righteous (right-leaning)",
      "stubborn (centrist)",
      "friendly (centrist)",
      "thoughtful (centrist)",
      "sarcastic (centrist)",
      "sassy (centrist)",
      "happy-go-lucky (centrist)",
      "curious (centrist)",
      "quirky (centrist)",
      "adventurous (centrist)",
      "intellectual (left-leaning)",
      "down-to-earth (centrist)",
      "idealistic (left-leaning)",
      "pragmatic (right-leaning)",
      "cheerfully clueless (centrist)",
      "indecisive (centrist)",
      "overly eager (centrist)",
      "eccentric (centrist)",
      "whimsical (centrist)",
      "melodramatic (centrist)",
      "nostalgic (centrist)",
      "romantic (centrist)",
      "skeptical (centrist)",
      "dreamy (centrist)",
      "overly analytical (centrist)",
      "spiritual (centrist)",
      "spontaneous (centrist)",
      "shy and reserved (centrist)",
      "hyper-organized (centrist)",
      "daydreamer (centrist)",
      "workaholic (centrist)",
      "insecure (centrist)",
      "rebellious (left-leaning)",
      "neurotic (centrist)",
    ];

    const interests = [
      "music",
      "movies",
      "anime",
      "scientific discoveries and innovations",
      "historical facts and events",
      "video games",
      "cooking",
      "travel",
      "emerging technology trends",
      "sports and outdoor activities",
      "art",
      "nature",
      "literature",
      "photography",
      "fashion",
      "health",
      "food",
      "comedy",
      "psychology",
      "philosophy",
      "environment",
      "pets",
    ];

    const botInterests = getRandomInterests(2, interests);
    const botDisinterests = getRandomDisinterests(2, interests, botInterests);

    const newBot = new User(
      botUsername,
      botEmail,
      botPassword,
      undefined,
      true,
      avatar,
      getRandomPersonality(personalities),
      botInterests.join(", "),
      botDisinterests
    );

    await newBot.signup();

    return await newBot.getUser("username", newBot.username);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("create bot users error");
  }
};

export const createBotUsers = async (count: number) => {
  const botUsersPromise = Array.from({ length: count }, () => createBotUser());

  try {
    const createdBots = await Promise.all(botUsersPromise);
    return createdBots;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("create bots users error");
  }
};
