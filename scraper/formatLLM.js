import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";



import * as cheerio from "cheerio";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";


const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });
const SERP_API = process.env.SERP_API;
const apiURL = "http://localhost:5000/articles";

async function getGoogleLinks(title) {
  const res = await axios.get("https://serpapi.com/search", {
    params: { q: title, api_key: SERP_API, engine: "google" }
  });

  return res.data.organic_results
    .filter(r => r.link.includes("blog") || r.link.includes("article"))
    .slice(0, 2)
    .map(r => r.link);
}

async function scrapeMain(url) {
  const res = await axios.get(url);
  const dom = new JSDOM(res.data, { url });
  const reader = new Readability(dom.window.document);
  return reader.parse()?.textContent || "";
}

async function runFormatter() {
  const { data: articles } = await axios.get(apiURL);

  for (const art of articles) {
    const links = await getGoogleLinks(art.title);

    const ref1 = await scrapeMain(links[0]);
    const ref2 = await scrapeMain(links[1]);

    const prompt = `
    Rewrite the following article to match formatting & writing style of references:

    ORIGINAL TITLE: ${art.title}
    ORIGINAL CONTENT: ${art.content}

    REFERENCE 1: ${ref1}
    REFERENCE 2: ${ref2}

    Add references at bottom.
    `;

    const llmRes = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }]
    });

    const updated = llmRes.choices[0].message.content;

    await axios.put(`http://localhost:5000/articles/${art.id}`, {
      title: art.title,
      content: updated + `\n\nReferences:\n1. ${links[0]}\n2. ${links[1]}`
    });

    console.log(`Formatted & Updated: ${art.title}`);
  }
}

runFormatter();
