from app import create_app

application = app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port="5002", debug=app.config["DEBUG"])