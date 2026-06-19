@echo off
echo ==============================================
echo PUSHING PROJECT TO GITHUB (BOTH BRANCHS)
echo ==============================================
echo.
set /p REPO_URL="Enter your GitHub Repository URL (e.g. https://github.com/your-username/your-repo.git): "
if "%REPO_URL%"=="" (
    echo Error: URL cannot be empty.
    pause
    exit /b
)
echo.
echo Linking remote origin...
git remote remove origin >nul 2>&1
git remote add origin %REPO_URL%
echo.
echo Pushing branch "main" (default branch) to GitHub...
git push -u origin main
echo.
echo Pushing branch "project-management" to GitHub...
git push -u origin project-management
echo.
echo.
echo ==============================================
echo Next Step: Live Link Deployment via Vercel
echo ==============================================
echo 1. Open https://vercel.com/new in your browser.
echo 2. Import your newly pushed repository.
echo 3. IMPORTANT: Under "Project Settings", locate "Root Directory"
echo    and click "Edit" to select the "frontend" folder!
echo 4. Click Deploy to build and get your public live link!
echo ==============================================
echo.
pause
