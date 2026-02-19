import subprocess
import sys
import os
from pathlib import Path

def main():
    print("Fraud Predictor FastAPI Server")    
    # Get the directory where this script is located
    script_dir = Path(__file__).parent.absolute()
    os.chdir(script_dir)
    
    # Install requirements
    print("Installing dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-q", "-r", "requirements.txt"])
        print("✓ Dependencies installed\n")
    except subprocess.CalledProcessError:
        print("✗ Failed to install dependencies")
        sys.exit(1)
    
    # Start the FastAPI server
    print("Starting FastAPI Server...")
    print(f"Server running at: http://localhost:5000")
    print(f"API Documentation: http://localhost:5000/docs")
    print("Press Ctrl+C to stop the server\n")
    
    try:
        subprocess.run([
            sys.executable, "-m", "uvicorn", 
            "main:app", 
            "--reload", 
            "--host", "0.0.0.0", 
            "--port", "5000",
            "--log-level", "error"
        ])
    except KeyboardInterrupt:
        print("\n\nServer stopped.")
        sys.exit(0)

if __name__ == "__main__":
    main()
