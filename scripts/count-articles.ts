import { adminDb } from "@/lib/firebase/admin";
import { isIndexable, MIN_INDEXABLE_WORDS } from "@/lib/firebase/server-data";

async function main() {
  const pub = await adminDb.collection("articles").where("status", "==", "published").get();
  let indexable = 0;
  let thin = 0;
  pub.docs.forEach((d) => {
    if (isIndexable(d.data())) indexable++;
    else thin++;
  });
  console.log(`threshold: ${MIN_INDEXABLE_WORDS} words`);
  console.log(`published: ${pub.size} | indexable (kept): ${indexable} | thin (delisted+noindex): ${thin}`);
  process.exit(0);
}
main().catch((e) => { console.error(e); process.exit(1); });
