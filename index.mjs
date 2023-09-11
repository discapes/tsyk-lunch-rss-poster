import { error } from "console";
import { configDotenv } from "dotenv";
configDotenv();

const colors = [
	6821567, 6893541, 10564832, 12338152, 15688959, 16286463, 16744942, 16625407, 16763895,
	16769270, 16759249, 16748747, 16728261, 11796603, 14222215, 15859861, 16199808, 13983853,
	15369596, 16752009, 16765330, 15782542, 13419613, 11386468, 7384641, 11851137, 14611881,
	16646135, 16580565, 16775572, 9568170, 980131, 53185, 4390904, 1760511, 769013, 41950, 42451,
	36062, 5921528,
];
const menuUrl =
	"https://menu.kaarea.fi/KaareaAromieMenus/FI/Default/Kaarea/TSYKLU/Rss.aspx?Id=456d0033-1d0b-4926-b1b3-7fd105e1ae6a&DateMode=0";
const webhookUrl = process.env.WEBHOOK_URL ?? "asdf";
	
// because incomplete chain https://www.ssllabs.com/ssltest/analyze.html?d=menu.kaarea.fi
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

export async function handler() {
	const color = colors[Math.floor(Math.random() * colors.length)];
	const rss = await fetch(menuUrl).then((res) => res.text());
	const lounas = rss.match(/Lounas\s*:\s*(.*?) \(/)?.[1];
	const kasvisLounas = rss.match(/Kasvislounas\s*:\s*(.*?) \(/)?.[1];

	await fetch(webhookUrl, {
		method: "POST",
		body: JSON.stringify({
			embeds: [
				{
					type: "rich",
					color,
					title: new Date().toLocaleDateString("fi-FI"),
					description: ["Lounas: " + lounas, "Kasvislounas: " + kasvisLounas].join("\n"),
				},
			],
		}),
		headers: {
			"content-type": "application/json",
		},
	}).then((res) => res.text());
}
handler();