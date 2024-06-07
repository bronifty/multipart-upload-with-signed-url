# sync local with remote
git pull origin main

# overwrite the index (staging area) and working tree (local files) with the latest commit on the branch
git restore --source=HEAD --staged --worktree .obsidian/workspace.json


# Details
1. git add file01 # Adds 'file01' from the working set to the staging area.
2. git commit -m "message" # Commits whatever is staged in the 'index' by `git add`.
3. git push -u origin main # Syncs the local branch 'main' with 'origin/main' on the remote and sets the upstream tracking.
4. git add file01 # Add modifield 'file01' from the working set to staging area.
5. git restore --source=HEAD --staged --worktree file01 # Reverts the index and working tree to the last commit for 'file01'.
6. git fetch origin main # Fetches updates from 'origin/main' into the local remote-tracking branch 'origin/main'.
7. git checkout main # Switches to the local 'main' branch.
8. git merge origin/main # Merges the remote-tracking branch 'origin/main' into the local 'main' branch.
9. echo "yes hello this is dog from cpu02" > file02 # setup a merge conflict to resolve on cpu01
10. git add file02 # add file02 to staging area on cpu02
11. git commit -m "message" # commit file02 to main branch on cpu02
12. git push -u origin main # push to remote from cpu02
13. echo "yes hello this is dog from cpu01" > file02 # create a file with a merge conflict on cpu01
14. git add file02 # add file02 to staging area on cpu01
15. git commit -m "message" # commit file02 to main branch on cpu01
16. git push -u origin main # push to remote from cpu01 causing merge conflict which must be resolved with fetch, checkout, merge, and restore
17. git fetch origin main # fetch main branch from origin remote on cpu01
18. git checkout main # switch to local main branch on cpu01 to merge with remote-tracking branch origin/main which was just fetched from the remote
19. git merge origin/main # merge the remote-tracking branch origin/main into the local main branch on cpu01 which will cause a merge conflict with file02
20. git restore --source=origin/main --staged --worktree -- git/file02 # resolve merge conflict by overwriting the index and working tree with the latest commit on the remote-tracking branch origin/main (the last -- before the filename is a delimiter to separate the options from the filename)
21. git add file02 # add file02 to staging area on cpu01
22. git commit -m "message" # commit the merge resolution to main branch on cpu01
23. git push -u origin main # push to remote from cpu01 
24. echo "reset" > file03 && git add file03 && git commit -m "commit to reset softly" 
25. git reset --soft HEAD~1 # reset to previous commit with changes still in staging area and worktree
26. git commit -m "message" # commit to reset mixed
27. git reset --mixed HEAD~1 # reset to previous commit with changes still in worktree but not staged
28. git add file03 && git commit -m "commit to reset hard"
29. git reset --hard HEAD~1 # reset to previous commit with no changes in staging area or worktree (erases changes since last commit)
