	
# Permission Explainer
	
A tool that explains, in plain language, what app permissions actually mean — and why they matter — plus a check for whether the website an app came from is safe.
	
## Why I built this
	
Most people tap "Allow" on app permission requests without understanding what they're actually granting. I wanted to build a simple too to help people make security decisions.
Security tools are often written for people who already understand security. This one is written for people who don't , using plain language, so the person deciding whether to tap "Allow" actually understands what they're agreeing to.
	
## Features
	
- **Paste permission text** — paste what an app is asking for and get a plain-language explanation of each permission, a realistic misuse example, and a risk level (low / medium / high).
- **Upload a screenshot** — upload a screenshot of an app's permission request and the app extracts the text automatically (OCR via Tesseract.js) and explains it the same way.
- **Website safety check** — check the domain an app or link came from against VirusTotal's database to see how many security vendors flag it as malicious.
	
## Tech stack
- **Frontend:** React (Vite), Tesseract.js for in-browser OCR
- **Backend:** Node.js, Express
- **External API:** VirusTotal API v3
	
## Running it locally

**Backend:**
cd Backend
npm install
Create a `.env` file in `Backend/` with:
VIRUSTOTAL_API_KEY=your_api_key_here
Then:
node index.js
	
**Frontend:**
cd Frontend
npm install
npm run dev
	
	
Then open the local URL shown in the terminal (usually `http://localhost:5173`).
	
## Notes
	
- Permission explanations currently cover common Android permissions.
- The VirusTotal free tier has a rate limit (4 requests/minute), so repeated rapid domain checks may be temporarily blocked.
