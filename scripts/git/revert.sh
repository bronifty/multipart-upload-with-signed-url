#!/bin/bash

# disregard all changes since last commit
git checkout -- .

# revert HEAD to previous commit state with a new commit (commit 2 goes back to commit 1's state in commit 3)
# git revert --no-edit HEAD

# revert to specific commit and push
# git revert <commit-hash>
# git push origin <branch-name>

# git reflog is git log --decorate including entries that have been reset or rebased

# git revert is checking out of a previous commit and into a new commit