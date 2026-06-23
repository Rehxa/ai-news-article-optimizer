// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// export async function optimizeText(content) {
//   const response = await fetch(
//     `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         contents: [
//           {
//             parts: [
//               {
//                 text: `
//                   You are an AI writing assistant.

//                   Improve the grammar, clarity, and readability
//                   of this text while preserving meaning.

//                   Return ONLY the optimized text.

//                   TEXT:
//                   ${content}
//                 `,
//               },
//             ],
//           },
//         ],
//       }),
//     },
//   );

//   const data = await response.json();

//   console.log("Status:", response.status);
//   console.log("Response:", data);

//   if (!response.ok) {
//     throw new Error(data?.error?.message || "Gemini request failed");
//   }

//   console.log(data);

//   return (
//     data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated."
//   );
// }
