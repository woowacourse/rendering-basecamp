import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { MovieList } from "@/components/MovieList"
import Head from "next/head"

const movies = [
  {
    adult: false,
    backdrop_path: "/9DYFYhmbXRGsMhfUgXM3VSP9uLX.jpg",
    genre_ids: [27],
    id: 1038392,
    original_language: "en",
    original_title: "The Conjuring: Last Rites",
    overview:
      "Paranormal investigators Ed and Lorraine Warren take on one last terrifying case involving mysterious entities they must confront.",
    popularity: 495.5964,
    poster_path: "/7JzOmJ1fIU43I3gLHYsY8UzNzjG.jpg",
    release_date: "2025-09-03",
    title: "The Conjuring: Last Rites",
    video: false,
    vote_average: 6.951,
    vote_count: 940,
  },
  {
    adult: false,
    backdrop_path: "/ax2qCKU6tUhdkStiCnrDdXKA5xC.jpg",
    genre_ids: [28, 12],
    id: 1086910,
    original_language: "en",
    original_title: "The Lost Princess",
    overview:
      "After an Ayahuasca vision transports him to a haunted castle, Alec meets Hanna who tales him the story of her mother's forced marriage and how the forbidden passion with her father was in danger when the princess pregnancy became obvious",
    popularity: 303.0106,
    poster_path: "/31S2ISsDtbnxb0kuXZl1SxSMD0K.jpg",
    release_date: "2025-10-16",
    title: "The Lost Princess",
    video: false,
    vote_average: 6.286,
    vote_count: 21,
  },
  {
    adult: false,
    backdrop_path: "/wyg8OaiDFru4NWuEnhCIsF3W1Ek.jpg",
    genre_ids: [28, 35, 878],
    id: 338969,
    original_language: "en",
    original_title: "The Toxic Avenger Unrated",
    overview:
      "When a downtrodden janitor, Winston Gooze (Peter Dinklage), is exposed to a catastrophic toxic accident, he’s transformed into a new kind of hero: The Toxic Avenger. Now, Toxie must rise from outcast to savior, taking on ruthless corporate overlords and corrupt forces who threaten his son, his friends, and his community.",
    popularity: 282.7029,
    poster_path: "/sIonGSpGNtH72OzbJllPOEMNjVU.jpg",
    release_date: "2025-08-28",
    title: "The Toxic Avenger Unrated",
    video: false,
    vote_average: 6.191,
    vote_count: 118,
  },
  {
    adult: false,
    backdrop_path: "/1RgPyOhN4DRs225BGTlHJqCudII.jpg",
    genre_ids: [16, 28, 14, 53],
    id: 1311031,
    original_language: "ja",
    original_title: "劇場版「鬼滅の刃」無限城編 第一章 猗窩座再来",
    overview:
      "The Demon Slayer Corps are drawn into the Infinity Castle, where Tanjiro, Nezuko, and the Hashira face terrifying Upper Rank demons in a desperate fight as the final battle against Muzan Kibutsuji begins.",
    popularity: 299.7285,
    poster_path: "/sUsVimPdA1l162FvdBIlmKBlWHx.jpg",
    release_date: "2025-07-18",
    title: "Demon Slayer: Kimetsu no Yaiba Infinity Castle",
    video: false,
    vote_average: 7.807,
    vote_count: 456,
  },
  {
    adult: false,
    backdrop_path: "/iZLqwEwUViJdSkGVjePGhxYzbDb.jpg",
    genre_ids: [878, 53],
    id: 755898,
    original_language: "en",
    original_title: "War of the Worlds",
    overview:
      "Will Radford is a top analyst for Homeland Security who tracks potential threats through a mass surveillance program, until one day an attack by an unknown entity leads him to question whether the government is hiding something from him... and from the rest of the world.",
    popularity: 289.9369,
    poster_path: "/yvirUYrva23IudARHn3mMGVxWqM.jpg",
    release_date: "2025-07-29",
    title: "War of the Worlds",
    video: false,
    vote_average: 4.333,
    vote_count: 626,
  },
  {
    adult: false,
    backdrop_path: "/a6RkQIOZ6wThQOEDv6lHsfH53hD.jpg",
    genre_ids: [28, 80, 53],
    id: 1186350,
    original_language: "ml",
    original_title: "മാർക്കോ",
    overview:
      "The adoptive son of the Adattu family, Marco, sets off on a ruthless quest for vengeance after his brother is brutally murdered, finding only betrayal, loss and unimaginable brutality at every step.",
    popularity: 269.6168,
    poster_path: "/il3ao5gcF6fZNqo1o9o7lusmEyU.jpg",
    release_date: "2024-12-20",
    title: "Marco",
    video: false,
    vote_average: 6.3,
    vote_count: 68,
  },
  {
    adult: false,
    backdrop_path: "/5A01YSCPYoCOZOhh9tU7F3Htxkf.jpg",
    genre_ids: [28, 14, 27, 53],
    id: 793387,
    original_language: "ko",
    original_title: "거룩한 밤: 데몬 헌터스",
    overview:
      "When a devil-worshipping criminal network plunges Seoul into chaos, the police turn to Holy Night—a trio of supernatural demon hunters—to restore order and defeat the rising evil.",
    popularity: 241.5919,
    poster_path: "/v3Mo77Qjp6pctpD4eJaNT6kFRSB.jpg",
    release_date: "2025-04-30",
    title: "Holy Night: Demon Hunters",
    video: false,
    vote_average: 6.48,
    vote_count: 49,
  },
  {
    adult: false,
    backdrop_path: "/7FnmZCAjAwaHydgpjFKnu11MoWs.jpg",
    genre_ids: [878, 12],
    id: 617126,
    original_language: "en",
    original_title: "The Fantastic 4: First Steps",
    overview:
      "Against the vibrant backdrop of a 1960s-inspired, retro-futuristic world, Marvel's First Family is forced to balance their roles as heroes with the strength of their family bond, while defending Earth from a ravenous space god called Galactus and his enigmatic Herald, Silver Surfer.",
    popularity: 203.8354,
    poster_path: "/cm8TNGBGG0aBfWj0LgrESHv8tir.jpg",
    release_date: "2025-07-23",
    title: "The Fantastic 4: First Steps",
    video: false,
    vote_average: 7.136,
    vote_count: 1972,
  },
  {
    adult: false,
    backdrop_path: "/bNwxRkm97oLUhSYXpSvQNyWJFmg.jpg",
    genre_ids: [28, 12, 53],
    id: 1109086,
    original_language: "hi",
    original_title: "वॉर 2",
    overview:
      "Years ago Agent Kabir went rogue, became India’s greatest villain ever.  As he descends further into the deepest shadows... India sends its deadliest, most lethal agent after him, Agent Vikram  A Special Units Officer who is more than Kabir’s equal and a relentless Terminator driven by his own demons, determined to put a bullet into Kabir’s skull.",
    popularity: 217.6279,
    poster_path: "/tHUEGjexjpTDO3ggla9JQ6CojxU.jpg",
    release_date: "2025-08-13",
    title: "War 2",
    video: false,
    vote_average: 6.8,
    vote_count: 16,
  },
  {
    adult: false,
    backdrop_path: "/k6tdiMTO39RQj3dhfspuzprfoe0.jpg",
    genre_ids: [80],
    id: 941109,
    original_language: "en",
    original_title: "Play Dirty",
    overview:
      "Expert thief Parker gets a shot at a major heist, but to pull it off he and his team must outsmart a South American dictator, the New York mob, and the world's richest man.",
    popularity: 191.6351,
    poster_path: "/ovZ0zq0NwRghtWI1oLaM0lWuoEw.jpg",
    release_date: "2025-09-30",
    title: "Play Dirty",
    video: false,
    vote_average: 6.643,
    vote_count: 293,
  },
  {
    adult: false,
    backdrop_path: "/bWF5ImUscXXYia8owpm8coadR4m.jpg",
    genre_ids: [28, 27, 10752],
    id: 1257009,
    original_language: "en",
    original_title: "Primitive War",
    overview:
      "During the Vietnam War, a recon unit ventures to an isolated jungle valley to uncover the fate of a missing platoon. They soon find themselves in a fight for their lives against an unexpected enemy — prehistoric dinosaurs.",
    popularity: 181.9928,
    poster_path: "/nWBqU5YXmDVJWWEDJ4u3ZSseNVL.jpg",
    release_date: "2025-08-21",
    title: "Primitive War",
    video: false,
    vote_average: 6.917,
    vote_count: 103,
  },
  {
    adult: false,
    backdrop_path: "/9IHZeCusOd7RUaQpUrQJlKqjsUZ.jpg",
    genre_ids: [9648, 53, 80],
    id: 1290879,
    original_language: "en",
    original_title: "The Woman in Cabin 10",
    overview:
      "On a lavish yacht for an assignment, a journalist sees a passenger go overboard. But when no one believes her, she risks her life to uncover the truth.",
    popularity: 188.6798,
    poster_path: "/4kpdyePOlcELQQJcxXPF5GB1Adw.jpg",
    release_date: "2025-10-09",
    title: "The Woman in Cabin 10",
    video: false,
    vote_average: 6.119,
    vote_count: 214,
  },
  {
    adult: false,
    backdrop_path: "/da1mXvCrQrFcw6BxovCavBFbIvz.jpg",
    genre_ids: [27, 53],
    id: 1251717,
    original_language: "en",
    original_title: "Vicious",
    overview:
      "When Polly receives a mysterious box, it comes with one rule: place inside something she needs, something she hates, and something she loves. If she doesn’t obey, it will consume everything—and everyone—she’s ever known.",
    popularity: 170.4494,
    poster_path: "/shKGDGrwqmc9x2aTJcQszoXinq0.jpg",
    release_date: "2025-09-19",
    title: "Vicious",
    video: false,
    vote_average: 5.96,
    vote_count: 50,
  },
  {
    adult: false,
    backdrop_path: "/2OvpmWYrsv8eMyV3AAqhoMnzMF.jpg",
    genre_ids: [878, 12, 28],
    id: 533533,
    original_language: "en",
    original_title: "TRON: Ares",
    overview:
      "A highly sophisticated Program called Ares is sent from the digital world into the real world on a dangerous mission, marking humankind's first encounter with A.I. beings.",
    popularity: 163.8299,
    poster_path: "/chpWmskl3aKm1aTZqUHRCtviwPy.jpg",
    release_date: "2025-10-08",
    title: "TRON: Ares",
    video: false,
    vote_average: 6.495,
    vote_count: 203,
  },
  {
    adult: false,
    backdrop_path: "/yGByIyqgJerCw7AAphTrTAlrdkJ.jpg",
    genre_ids: [28, 10752, 53, 36],
    id: 1328803,
    original_language: "en",
    original_title: "Prisoner of War",
    overview:
      "British RAF Wing Commander James Wright is captured by the Japanese during WWII and forced to fight in brutal hand-to-hand combat. The Japanese soldiers get more than they bargained for when Wright’s years of martial arts training in Hong Kong prove him to be a formidable opponent.",
    popularity: 144.2652,
    poster_path: "/1XET89sjRm9mUuHXhGIlKTNd5uD.jpg",
    release_date: "2025-09-19",
    title: "Prisoner of War",
    video: false,
    vote_average: 7.012,
    vote_count: 82,
  },
  {
    adult: false,
    backdrop_path: "/jzzpCJWkVZZwAxzzLmtYN0MBWFd.jpg",
    genre_ids: [27, 9648],
    id: 986097,
    original_language: "en",
    original_title: "HIM",
    overview:
      "After suffering a potentially career-ending brain trauma, Cameron Cade receives a lifeline when his hero, legendary eight-time Championship quarterback and cultural megastar Isaiah White, offers to train Cam at Isaiah's isolated compound that he shares with his celebrity influencer wife. But as Cam's training accelerates, Isaiah's charisma begins to curdle into something darker.",
    popularity: 145.9778,
    poster_path: "/qPJzcYR2f1O1uynYBCVPPJuOiAH.jpg",
    release_date: "2025-09-18",
    title: "HIM",
    video: false,
    vote_average: 5.9,
    vote_count: 129,
  },
  {
    adult: false,
    backdrop_path: "/w3Bi0wygeFQctn6AqFTwhGNXRwL.jpg",
    genre_ids: [14, 10402, 35, 16],
    id: 803796,
    original_language: "en",
    original_title: "KPop Demon Hunters",
    overview:
      "When K-pop superstars Rumi, Mira and Zoey aren't selling out stadiums, they're using their secret powers to protect their fans from supernatural threats.",
    popularity: 143.3151,
    poster_path: "/AjlRXTpRLAIiuofNqKcqrpUfPCZ.jpg",
    release_date: "2025-06-20",
    title: "KPop Demon Hunters",
    video: false,
    vote_average: 8.27,
    vote_count: 1666,
  },
  {
    adult: false,
    backdrop_path: "/yOFqBpJ0PEkBdQqalDEaeOiaKbz.jpg",
    genre_ids: [28, 80, 53],
    id: 1267319,
    original_language: "ko",
    original_title: "사마귀",
    overview:
      "Mantis, an ace assassin, returns to the contract killer industry after a hiatus, encountering his trainee friend Jae-yi and a retired legendary killer Dok-go, who now runs the organization.",
    popularity: 133.8426,
    poster_path: "/xS9bbciDC5lHPgl79SrPyzxKAXL.jpg",
    release_date: "2025-09-26",
    title: "Mantis",
    video: false,
    vote_average: 5.936,
    vote_count: 86,
  },
  {
    adult: false,
    backdrop_path: "/znMUHotZRTcyIFWFz2bvcpSx6YP.jpg",
    genre_ids: [28],
    id: 1053008,
    original_language: "en",
    original_title: "Fight Another Day",
    overview:
      "Follows a tough cop, who after being transported to a dystopian future, must enter a deadly combat tournament to be able to return to his past.",
    popularity: 118.145,
    poster_path: "/fKnLt1xQV0RdpN6RViowEiD1dFW.jpg",
    release_date: "2024-10-09",
    title: "Fight Another Day",
    video: false,
    vote_average: 5.111,
    vote_count: 18,
  },
  {
    adult: false,
    backdrop_path: "/538U9snNc2fpnOmYXAPUh3zn31H.jpg",
    genre_ids: [28, 12, 53],
    id: 575265,
    original_language: "en",
    original_title: "Mission: Impossible - The Final Reckoning",
    overview:
      "Ethan Hunt and team continue their search for the terrifying AI known as the Entity — which has infiltrated intelligence networks all over the globe — with the world's governments and a mysterious ghost from Hunt's past on their trail. Joined by new allies and armed with the means to shut the Entity down for good, Hunt is in a race against time to prevent the world as we know it from changing forever.",
    popularity: 125.7549,
    poster_path: "/z53D72EAOxGRqdr7KXXWp9dJiDe.jpg",
    release_date: "2025-05-17",
    title: "Mission: Impossible - The Final Reckoning",
    video: false,
    vote_average: 7.267,
    vote_count: 1917,
  },
]

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta
          name="description"
          content="Generated by create next app"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link
          rel="icon"
          href="/favicon.ico"
        />
      </Head>
      <div id="wrap">
        <Header featuredMovie={movies[0]} />
        <MovieList movies={movies} />
        <Footer />
      </div>
    </>
  )
}
