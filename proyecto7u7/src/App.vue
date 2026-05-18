<template>
  <router-view/>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --cream:       #F7F3EE;
  --cream-light: #FFFAF5;
  --cream-mid:   #F2EDE6;
  --border:      #EAE0D5;
  --border-mid:  #D5C9BC;
  --green:       #4A7C59;
  --green-light: #6B9E78;
  --green-bg:    #E8F3EB;
  --green-dark:  #3A6449;
  --text-dark:   #2C1F14;
  --text-mid:    #5C4A38;
  --text-muted:  #8C7460;
  --text-faint:  #A89880;
  --text-pale:   #C4B4A0;
}

html, body {
  background: var(--cream);
  font-family: 'DM Sans', sans-serif;
  color: var(--text-dark);
  min-height: 100vh;
}

#app {
  font-family: 'DM Sans', sans-serif;
  background: var(--cream);
  min-height: 100vh;
  text-align: left;
  color: var(--text-dark);
}

button, input, textarea, select { font-family: 'DM Sans', sans-serif; }
a { font-family: 'DM Sans', sans-serif; }

/* Scrollbar bonita */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--cream-mid); }
::-webkit-scrollbar-thumb { background: var(--border-mid); border-radius: 3px; }
</style>