# To-Do-List
Diese To-Do-List läuft auf localhost und verwendet Golang für das Backend sowie React.js für das Frontend. Das Backend läuft auf dem Port 4000 und das Frontend läuft auf dem Port 3000
GOLANG PROJEKT FÜR DAS BACKEND
Für das Go Projekt muss man folgende Packages installieren:
  - fiber WebFramework (https://pkg.go.dev/github.com/gofiber/fiber/v2#section-documentation)
  - JSON Web Token package (https://pkg.go.dev/github.com/dgrijalva/jwt-go/v4)
  - scrypt key derivation (https://pkg.go.dev/golang.org/x/crypto/scrypt)
  - middleware for the Fiber web framework (https://pkg.go.dev/github.com/gofiber/fiber/v2/middleware/cors)
  - MySQL database driver (https://pkg.go.dev/gorm.io/driver/mysql)
Für das Implementierung von eine JWT Authentifizierung und Autorisierung habe ich die Idee von foldende Youtube Video gelernt: https://www.youtube.com/watch?v=d4Y2DkKbxM0
Es ist wichtig zu betonen, dass ich kein Code kopiert habe, sondern habe ich lediglich die Idee gelernt. Der Rest ist der Code ist meine eigene Idee sowie Implementierungen

REACT PROJEKT FÜR DAS FRONTEND
Für das React.js Projekt muss man folgende Packages installieren:
  - bootstrap 5.3.3 für Styling
  - react-router-dom 6.22.2 für Navigationen zwischen Seiten
Für das styling einige Komponente wie Loginform, Navigationsbar, und Listdarstellung habe ich Bootstrap Example aus offene Quellen genommen:
  - Navigation Bar: https://getbootstrap.com/docs/5.3/examples/navbar-bottom/
  - LoginForm: https://getbootstrap.com/docs/5.3/examples/sign-in/
  - ListDarstellungsformat: https://mdbootstrap.com/docs/standard/extended/to-do-list/
Hier ist noch mal zu betonen, dass ich diese Komponente nach der Funktionen meiner ToDo List angepasst und umgewandelt. Es wird nicht kopiert.

Anleitung zur Verwendung des ToDoList:
- Auf der Startseite kann man mit der Navigationsleiste die Mölichkeit haben, ein Account zu erstellen oder mit vorhandene Account sich einzuloggen
- Nachdem Login sieht man eine Liste von Kategorien (falls man welche erstellt hat). Man hat folgende Aktionen mit seinem ToDo List:
    1. ToDo aktualisieren: Man kann eine Kategorie neu erstellen(Kategorie name ist eindeutig, man kann nicht 2 Kategorie mit gleichen Namen haben), löschen. Eine Kategorie kann geöffnet
       werden mit Taste "Open", nachdem Öffnen sieht man eine Liste von allen ToDo Items in dieser Kategorie. Für jeder Item kann man als "Done" markieren oder löschen. Man kann auch neu Item hinzufügen
    3. ToDo verschieben: Man kann eine Kategorie in der Liste nach oben, nach unten verschieben
