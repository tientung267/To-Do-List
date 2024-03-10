# To-Do-List
Diese To-Do-List läuft auf localhost und verwendet Golang für das Backend sowie React.js für das Frontend. Das Backend läuft auf dem Port 4000 und das Frontend läuft auf dem Port 3000

## GOLANG PROJEKT FÜR DAS BACKEND
Für das Go-Projekt müssen folgende Packages installiert werden:
  - fiber WebFramework (https://pkg.go.dev/github.com/gofiber/fiber/v2#section-documentation)
  - JSON Web Token package (https://pkg.go.dev/github.com/dgrijalva/jwt-go/v4)
  - scrypt key derivation (https://pkg.go.dev/golang.org/x/crypto/scrypt)
  - middleware for the Fiber web framework (https://pkg.go.dev/github.com/gofiber/fiber/v2/middleware/cors)
  - MySQL database driver (https://pkg.go.dev/gorm.io/driver/mysql)
  - 
Es benötigt eine Verbindung zur Datenbank. In meinem Fall habe ich MySQL verwendet. Da ich VSCode verwendet habe, gibt es eine Extension (SQLTools) zur Herstellung einer Verbindung zur MySQL-Datenbank. Die Einstellungen für die Datenbankverbindung (Port, Server, Benutzername, Passwort) finden sich unter ToDoList/cmd/.vscode/settings.json.

Für das Implementierung von eine JWT Authentifizierung und Autorisierung habe ich die Idee von foldende Youtube Video gelernt: https://www.youtube.com/watch?v=d4Y2DkKbxM0 .Es ist wichtig zu betonen, dass ich kein Code kopiert habe, sondern habe ich lediglich die Idee gelernt. Alle anderen Teile sind meine eigene Ideen sowie Implementierungen

Projekt starten: go run main.go


## REACT PROJEKT FÜR DAS FRONTEND
Für das React.js Projekt muss node_modules und folgende npm Packages installiert werden:
  - bootstrap 5.3.3 für Styling
  - react-router-dom 6.22.2 für Navigationen zwischen Seiten
Für das Styling habe ich einige Komponenten wie Loginformular, Navigationsleiste und Listenansicht aus offenen Quellen von Bootstrap übernommen und sie entsprechend den Funktionen meiner ToDo-Liste angepasst:
  - Navigation Bar: https://getbootstrap.com/docs/5.3/examples/navbar-bottom/
  - LoginForm: https://getbootstrap.com/docs/5.3/examples/sign-in/
  - ListDarstellungsformat: https://mdbootstrap.com/docs/standard/extended/to-do-list/
Hier ist noch einmal zu betonen, dass ich diese Komponenten nach den Funktionen meiner ToDo-Liste angepasst und umgewandelt habe. Es wurde nichts einfach kopiert.

Anleitung zur Verwendung des ToDoList:
- Auf der Startseite kann man mit der Navigationsleiste die Mölichkeit haben, ein Account zu erstellen oder mit vorhandene Account sich einzuloggen
- Nach dem Login sieht man zwei Listen von Kategorien. Eine enthält die Listen, die man selbst erstellt hat (falls vorhanden), und die andere enthält die Listen von anderen Benutzern, die diese Listen mit einem geteilt haben. Man hat folgende Aktionen mit seinem ToDo List:
    1. ToDo aktualisieren: Man kann eine Kategorie neu erstellen(Kategorie name ist eindeutig, man kann nicht 2 Kategorie mit gleichen Namen haben), löschen.
    2. ToDo verschieben: Man kann eine Kategorie in der Liste nach oben, nach unten verschieben mit Taste "up", "down".
    3. ToDo Kategorien: ToDo sind in Kategorien geteilt. Eine Kategorie kann geöffnet werden mit Taste "Open", nachdem Öffnen sieht man eine Liste von allen ToDo Items
       in dieser Kategorie. Für jeder Item kann man als "Done" markieren oder löschen. Man kann auch neu Item hinzufügen. Jeder Item hat Titel und Text, die man beim erstellen festlegen kann. Wenn
       man auf "Get Back" klickt, kommnt man zurück zu Kategorienliste.
    4. Bonus: ToDo teilen: Es gibt ein Inputfeld, wo man username von einer Account eingeben kann, mit wem man eine bestimmte Kategorie teilen will. Wenn man einen nicht existierenden Username eingibt
       wird einfach nicht passieren. Man kann auch seinen eigenen usernamen eingeben, dann taucht die Kategorie in eigenen Liste und geteilte Liste beide auf.
       
Projekt starten: npm start

Beim Nachfragen stehe ich euch gern zur Verfügung
