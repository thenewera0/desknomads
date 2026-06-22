const fs = require('fs');

async function test() {
  try {
    const res = await fetch('http://localhost:3000');
    const html = await res.text();
    const match = html.match(/href="(\/_next\/static\/chunks\/[^"]+\.css)"/);
    if (!match) {
      console.log('CSS file link not found in HTML');
      return;
    }
    const cssUrl = 'http://localhost:3000' + match[1];
    const cssRes = await fetch(cssUrl);
    const css = await cssRes.text();
    
    console.log('CSS Length:', css.length);
    console.log('Contains bg-[#071120]:', css.includes('bg-[#071120]') || css.includes('bg-\\[\\#071120\\]'));
    console.log('Contains mt-16:', css.includes('mt-16') || css.includes('mt\\:mt-16') || css.includes('mt\\-16'));
    console.log('Contains py-24:', css.includes('py-24') || css.includes('py\\-24'));
    console.log('Contains py-36:', css.includes('py-36') || css.includes('py\\-36'));
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
