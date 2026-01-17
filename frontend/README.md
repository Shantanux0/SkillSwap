# SkillSwap Frontend

Modern React + TypeScript frontend for the enhanced bidirectional skill matching system.

## Features

✅ **Skill Management** - Add, edit, delete skills with proficiency levels  
✅ **Swap Matching** - Find perfect learning partners with 8-component algorithm  
✅ **Match Details** - View detailed compatibility breakdown  
✅ **Test Validation** - Enforces test requirements before teaching  
✅ **Responsive Design** - Works on desktop and mobile

## Tech Stack

- React 18
- TypeScript
- Vite
- CSS3 (No framework)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend running on http://localhost:8080

### Installation

```bash
cd frontend
npm install
```

### Running Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Building for Production

```bash
npm run build
npm run preview  # Preview production build
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── SkillManagement.tsx      # Skill CRUD interface
│   │   ├── SkillManagement.css
│   │   ├── SwapMatching.tsx         # Match finding interface
│   │   └── SwapMatching.css
│   ├── services/
│   │   ├── skillLevelService.ts     # Skill API calls
│   │   ├── profileService.ts        # Profile API calls
│   │   └── matchService.ts          # Matching API calls
│   ├── types/
│   │   └── index.ts                 # TypeScript definitions
│   ├── config/
│   │   └── api.ts                   # API configuration
│   ├── App.tsx                      # Main component
│   ├── App.css
│   └── main.tsx
└── package.json
```

## API Configuration

Backend URL is configured in `src/config/api.ts`:
```typescript
export const API_BASE_URL = 'http://localhost:8080';
```

For production, update this to your production backend URL.

## Authentication

The app expects a JWT token stored in `localStorage` with key `authToken`.

To set token:
```javascript
localStorage.setItem('authToken', 'your-jwt-token');
```

## Available Features

### 1. Skill Management (`/skills`)
- View all declared skills
- Add new skill with proficiency level
- Edit existing skills
- Delete skills
- Proficiency badges (Beginner, Intermediate, Advanced, Expert)

### 2. Swap Matching (`/matching`)
- Search for swap partners
- View PERFECT_SWAP vs PARTIAL_MATCH results
- See compatibility scores
- View detailed match breakdowns

## Customization

### Colors
Main colors are defined in CSS files:
- Primary: `#1976d2` (blue)
- Gradient: `#667eea` to `#764ba2` (purple gradient)
- Success: `#388e3c` (green)
- Warning: `#f57c00` (orange)

### Components
All components are standalone and can be used independently.

## Known Limitations

- No router (single page with tabs - easily add React Router if needed)
- No form validation library (uses browser validation)
- No state management library (uses React useState)
- Profile editing not included (add if needed using `profileService`)

## Next Steps for Your Developer

1. **Add React Router** for proper routing
2. **Add Profile Editing** using existing `profileService`
3. **Add Authentication Pages** (login/register)
4. **Add Test Taking Interface**
5. **Add Calendar Component** for availability schedule
6. **Integrate with real auth system**

## Support

For questions about the backend API, see:
- `frontend_requirements.md` - Complete API documentation
- Backend Swagger (if available)

---

**Built for SkillSwap Platform** | January 2026
