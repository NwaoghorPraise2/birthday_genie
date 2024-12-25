# Project: Birthday Genie

## Overview

The Birthday Genie app is designed to simplify birthday management and reminders. It allows users to manage the birthdays and details of their loved ones, schedule personalized messages, and receive timely reminders. Additionally, it provides gift suggestions with vendor links and calendar synchronization to streamline user experience.

## Features

### Phase One

1. **Landing Page**

    - Introduces the app and its functionality.

2. **Authentication Module**

    - **Sign-Up/Login**: Email-based sign-up and login.
    - **Email Verification**: Ensure verified accounts.
    - **Google Sign-Up/Login**: Users can sign up/login via Google and set their passwords.
    - **Resend Verification Link**: Option for unverified accounts.

3. **Dashboard**

    - **User Profile**: Options to update profile details like password, username, profile picture, and preferences.

4. **Birthday Management**

    - Add and manage single or multiple friends with details like name and date of birth.
    - Import friends (options to be decided).
    - View all friends with calendar integration for upcoming birthdays.
    - Edit and delete friend entries.

5. **Calendar Integration**

    - Sync birthdays with iOS, Android, and desktop calendars.

6. **Message Management**

    - Generate personalized messages based on relationships and preferences.
    - Send messages via email, WhatsApp, or text.
    - Schedule messages and manage message history.

7. **Preferences and Settings**
    - Set birthday notifications and message delivery times.
    - Default messaging channels.
    - Security options like password and username changes.

### Phase Two

1. Advanced messaging options: Multiple channels beyond WhatsApp.
2. Flexible reminders for individual or all friends.
3. Improved friend and birthday data importation.
4. Keep user journey history for analytics and support.

### Phase Three

1. Message editing before sending.
2. Explore advanced notification systems.

## Technical Workflow

### Git Workflow

1. **Cloning the Repository**

    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

2. **Pulling Latest Changes**

    ```bash
    git checkout main
    git pull origin main
    ```

3. **Creating a Feature Branch**

    ```bash
    git checkout -b <branch-name>
    ```

    - **Branch Naming Conventions**:
        - `feature/add-login`
        - `fix/update-navbar`
        - `refactor/dashboard-ui`

4. **Making Changes Locally**

    - Regularly check the status:
        ```bash
        git status
        ```

5. **Committing Changes**

    ```bash
    git add .
    git commit -m "<type>: <subject>"
    ```

    - **Commit Message Guidelines**:
        - Use the format: `<type>: <subject>`
        - Example: `git commit -m "chore: Setup Conventions"`
        - **Types**:
            - `feat`: New features
            - `fix`: Bug fixes
            - `docs`: Documentation changes
            - `style`: Code style changes (e.g., formatting)
            - `refactor`: Code refactoring
            - `perf`: Performance improvements
            - `test`: Adding or modifying tests
            - `build`: Build system or dependency changes
            - `ci`: Continuous integration changes
            - `chore`: Maintenance tasks
            - `revert`: Reverting previous changes
        - **Subject**:
            - Must be written in sentence case.
            - Be concise but descriptive.

6. **Pushing Changes**

    ```bash
    git push origin <branch-name>
    ```

7. **Creating a Pull Request (PR)**

    - Go to GitHub and click **Compare & Pull Request**.
    - Fill in the PR details with a clear title and description.

8. **Merging the Pull Request**

    - Review and confirm the changes before merging.
    - Click **Merge Pull Request** on GitHub.
    - Delete the branch post-merge.

9. **Updating Local Main Branch**

    ```bash
    git checkout main
    git pull origin main
    ```

10. **Deleting Local Feature Branch**

```bash
git branch -d <branch-name>
```

### Key Guidelines

-   **Never work directly on `main`.**
-   **Keep changes small and focused.**
-   **Pull the latest main branch before starting a new branch.**
-   **Write clear commit messages and branch names.**
-   **Review PRs carefully before merging.**

### Tools to Enhance Workflow

-   **Prettier/ESLint**: Automate code formatting.
-   **Git Hooks**: Use tools like Husky for pre-commit linting.
-   **GitHub Actions**: Automate CI/CD pipelines.

### Monetisation

-   Tiered plans based on message and friend limits.
-   Affiliate links from vendors.
-   Vendor registration for product showcases.
-   Advertisements.

### Social Media Strategy

-   Create Instagram and TikTok content for user suggestions and promotional posts.
-   Engage with users for feedback and feature requests.

---

This README ensures clarity for all team members, enhances collaboration, and provides a structured workflow to develop and maintain the project efficiently.

