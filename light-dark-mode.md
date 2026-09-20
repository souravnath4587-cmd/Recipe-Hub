I want to improve and standardize the color combination of my website for both **Light Mode and Dark Mode**.

### Goal

Create a modern, professional, clean, and visually consistent color system that works well across the entire website.

### Requirements

1. **Analyze the existing UI first**
   - Check the current colors, backgrounds, text colors, borders, buttons, cards, inputs, navbar, sidebar, modals, alerts, badges, and other components.
   - Identify inconsistent, low-contrast, or unnecessary colors.
   - Do not randomly change the existing design structure.

2. **Light Mode**
   - Use a clean and comfortable background.
   - Use a clear primary color for buttons, links, and important actions.
   - Use proper colors for:
     - Primary text
     - Secondary text
     - Muted text
     - Borders
     - Cards
     - Inputs
     - Hover states
     - Active states
     - Success
     - Warning
     - Error
     - Information

   - Avoid excessive use of pure `#000000` or pure saturated colors.
   - Maintain good readability and accessibility.

3. **Dark Mode**
   - Do not simply invert the Light Mode colors.
   - Use a proper dark background hierarchy such as:
     - Page background
     - Card background
     - Elevated/secondary background
     - Input background

   - Use comfortable light text instead of pure white everywhere.
   - Make borders subtle but visible.
   - Ensure buttons, links, badges, icons, and interactive elements remain clearly visible.
   - Avoid overly bright colors that cause eye strain.

4. **Color Consistency**
   Create a centralized color system/design token structure.

   Example categories:
   - `background`
   - `foreground`
   - `card`
   - `card-foreground`
   - `primary`
   - `primary-foreground`
   - `secondary`
   - `secondary-foreground`
   - `muted`
   - `muted-foreground`
   - `accent`
   - `accent-foreground`
   - `border`
   - `input`
   - `ring`
   - `success`
   - `warning`
   - `error`
   - `info`

5. **Component Consistency**
   Apply the color system consistently to:
   - Navbar
   - Sidebar
   - Hero sections
   - Cards
   - Buttons
   - Forms
   - Inputs
   - Dropdowns
   - Tables
   - Modals
   - Alerts
   - Badges
   - Tabs
   - Pagination
   - Dashboard components
   - Footer

6. **Accessibility**
   - Maintain sufficient contrast between text and background.
   - Make sure disabled, hover, focus, and active states are distinguishable.
   - Do not sacrifice readability for aesthetics.
   - Keep the UI comfortable for long-term use.

7. **Design Style**
   The final design should feel:
   - Modern
   - Professional
   - Minimal
   - Clean
   - Consistent
   - Premium
   - Easy to read

### Important

- First inspect the existing project and understand its current color usage.
- Reuse the existing brand/primary color if it already fits the design.
- Do not introduce many unnecessary colors.
- Keep the color palette limited and harmonious.
- Do not change layouts, spacing, typography, functionality, or component behavior unless absolutely necessary for the color system.
- Make sure switching between Light and Dark Mode feels natural and consistent throughout the entire website.
- After making the changes, check the major pages in both Light and Dark Mode and fix any inconsistent colors.

Finally, provide a short summary of:

1. The new Light Mode color palette
2. The new Dark Mode color palette
3. Which files/components were changed
4. Any contrast or UI issues that were fixed
