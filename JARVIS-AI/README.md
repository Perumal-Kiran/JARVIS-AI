# JARVIS AI — starter Android project

This is the first UI/build scaffold for the JARVIS AI Android app.

## Current contents
- Kotlin + Jetpack Compose Android app
- Package/application ID: `com.jarvis.ai`
- Black interface with red animated triangle
- "Sir" greeting
- GitHub Actions workflow to build a debug APK in the cloud

## Build on GitHub from your phone
1. Create a new GitHub repository named `JARVIS-AI`.
2. Upload the contents of this ZIP to the repository's root (not the ZIP file itself).
3. Open the repository's **Actions** tab.
4. Select **Build JARVIS APK** and run the workflow, or push to `main`.
5. Open the completed workflow run and download the `JARVIS-AI-debug` artifact.
6. Extract the artifact ZIP on your phone and install `app-debug.apk`. Android may ask you to allow installs from your browser or file manager.

## Important
This is a starter screen, not the finished assistant and not yet an APK. Voice recognition, AI responses, secure API access, alarms, contacts, call answering, and WhatsApp assistance are not connected yet. Call answering requires a separate Android call-integration stage and may require setting JARVIS as the default phone app. Android permissions and device policies limit what can run in the background.

Do not put an OpenAI API key in the Android app or GitHub source. A secure backend will be needed for AI requests.
