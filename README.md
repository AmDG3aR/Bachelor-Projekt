Das der Ordner f�r die Entwicklung unserer Anzeigen.

Grundlagen:

Wenn ihr etwas pushen wollt, m�sst ihr es zu erst hinzuf�gen:
git add Dateiname oder *(f�r alle �nderungen)
Dann folgt der Commit, hier eine kurze Nachricht was bearbeitet wurde:
git commit -m "Nachricht"
Dann folgt der Push auf das Repository:
git push origin master

Wenn ihr f�r euch Programmiert, ist es sinnvoll dies auf einen eigenen Branch zu tun.
Erstellt wird dieser �ber:
git branch Name
�ber git checkout Branchname wechselt ihr in diesem Branch.
Indem Branch k�nnt ihr wie oben genau so pushen, nur das der Master nicht ver�ndert wird.

In den Master nur fertige Elemente pushen, �ber einen Merge.
Daf�r wechselt ihr wieder in den Masterbranch:
git checkout master
Dann der Merge mit eurem Branch:
git merge Branchname


Ein paar Links bei Problemen mit Git:
https://rogerdudler.github.io/git-guide/
https://mirrors.edge.kernel.org/pub/software/scm/git/docs/
https://stackoverflow.com/questions/tagged/git