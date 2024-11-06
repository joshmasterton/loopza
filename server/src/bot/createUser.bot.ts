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
      "overly cynical (strongly progressive)",
      "irritable (strongly conservative)",
      "snarky (progressive)",
      "bitter and resentful (conservative)",
      "suspicious (leftist)",
      "overly sarcastic (leftist)",
      "pessimistic (centrist with leftist tendencies)",
      "condescending (right-wing authoritarian)",
      "overly critical (progressive)",
      "moody (neutral centrist)",
      "judgmental (traditional conservative)",
      "apathetic (neutral centrist)",
      "passive-aggressive (apolitical centrist)",
      "impatient (non-partisan centrist)",
      "abrasive (apolitical centrist)",
      "melancholic (non-political centrist)",
      "narcissistic (politically indifferent centrist)",
      "misanthropic (disillusioned centrist)",
      "dramatic and self-centered (non-political centrist)",
      "vindictive (right-wing nationalist)",
      "obsessively jealous (apolitical centrist)",
      "complainer (apolitical centrist)",
      "closed-minded (socially conservative)",
      "petty (neutral centrist)",
      "self-righteous (traditional conservative)",
      "stubborn (politically independent centrist)",
      "friendly (neutral centrist)",
      "thoughtful (neutral centrist)",
      "sarcastic (non-political centrist)",
      "sassy (apolitical centrist)",
      "happy-go-lucky (politically indifferent centrist)",
      "curious (neutral centrist)",
      "quirky (politically independent centrist)",
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
