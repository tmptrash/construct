// 23.10.2017 non cyclical mode
v0 = stepDown()
v2 = stepDown()
v2 = stepDown()
v1 = stepDown()
v2 = stepDown()
v1 = eatDown(v3)
v0 = stepRight()
v1 = stepLeft()
v3 = +!v2
v1 = stepUp()
v0 = stepUp()
for (v0 = v1; v0 < v2; v0++) {
    v2 = stepRight()
    v2 = lookAt(v0, v3)
    v0 = +!v2
    v1 = eatUp(v0)
    v2 = stepLeft()
}
v0 = fromMem()
v1 = toMem(v2)
for (v2 = v0; v2 < v3; v2++) {
    v2 = stepUp()
    v1 = eatUp(v1)
    v2 = stepUp()
    v2 = eatLeft(v1)
    v0 = eatLeft(v1)
    v3 = stepUp()
    v1 = v1
    v2 = 57160
    v3 = myY()
}
for (v0 = v1; v0 < v1; v0++) {
    v0 = stepLeft()
    v1 = 32689
    v2 = eatDown(v1)
    v0 = stepDown()
    v2 = eatLeft(v1)
    v1 = eatDown(v2)
    v0 = stepLeft()
}
v0 = myX()
v3 = v0
v1 = stepDown()
v0 = stepRight()
v2 = stepRight()
if (v3 == v1) {
    v0 = eatRight(v1)
    v2 = stepRight()
    v2 = checkLeft()
    for (v3 = v2; v3 < v2; v3++) {
        v1 = myY()
        v0 = stepUp()
        v0 = v3 - v0
    }
    v3 = toMem(v0)
    v0 = eatDown(v2)
    v1 = stepDown()
}
v2 = eatLeft(v3)
v1 = eatDown(v1)
v1 = stepDown()
v2 = eatRight(v3)
v2 = fromMem()
v3 = v3 * v3
for (v0 = v1; v0 < v2; v0++) {
    v3 = stepLeft()
    v3 = stepDown()
    v3 = checkUp()
    v0 = fromMem()
    v2 = stepDown()
    v3 = toMem(v0)
    v3 = checkRight()
    v3 = stepUp()
    v1 = myX()
    v1 = eatDown(v1)
    v1 = eatRight(v1)
    for (v1 = v0; v1 < v0; v1++) {
        if (v0 > v0) {}
    }
}
v0 = stepRight()
v1 = stepRight()
v3 = v1 * v3
v0 = eatUp(v3)
for (v0 = v1; v0 < v2; v0++) {
    v3 = stepLeft()
    v1 = stepLeft()
    v1 = eatLeft(v2)
    v2 = myX()
    if (v3 < v1) {
        v3 = checkRight()
        v2 = fromMem()
        v3 = v1 * v3
        for (v0 = v1; v0 < v2; v0++) {
            v3 = stepLeft()
            v1 = lookAt(v2, v1)
            v3 = myY()
            if (v3 > v0) {}
        }
    }
}
if (v3 < v1) {
    v2 = checkRight()
    v3 = checkDown()
    v1 = eatDown(v1)
    for (v0 = v1; v0 < v1; v0++) {}
}