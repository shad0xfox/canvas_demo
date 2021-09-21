<template>
  <v-card v-if="$props.selectedDialog" width="350">
    <template v-if="$props.selectedDialog.createDialog">
      <v-text-field
        ref="commentInput"
        append-icon="mdi-send"
        label="Leave a reply"
        @click:append="createMessage"
        @keydown.enter="createMessage"
        :disabled="isSending"
        :loading="isSending"
        v-model="inputValue"
      />
    </template>
    <template v-else>
      <v-container>
        <v-row>
          <v-switch
            v-model="resolved"
            label="Resolve"
            :disabled="isSending"
            :loading="isSending"
            @click="updateDialogStatus(ENUM_COMMENT_DIALOG_STATUS.RESOLVED)"
          />
          <v-icon
            right
            @click="updateDialogStatus(ENUM_COMMENT_DIALOG_STATUS.DELETED)"
          >
            mdi-close
          </v-icon>
        </v-row>
      </v-container>
      <v-divider />
      <v-card-text style="height: 150px" class="scroll">
        <template v-for="comment in $props.selectedDialog.comments">
          <div :key="comment.id">
            <div class="font-weight-normal">
              <strong>{{ comment.user.name }}</strong> @{{
                dayjs(comment.createdAt).format("YYYY/MM/DD HH:mm")
              }}
            </div>
            <div>{{ comment.message }}</div>
          </div>
        </template>
      </v-card-text>
      <v-divider></v-divider>
      <v-text-field
        ref="commentInput"
        append-icon="mdi-send"
        label="Leave a reply"
        @click:append="createMessage"
        @keydown.enter="createMessage"
        :disabled="isSending"
        :loading="isSending"
        v-model="inputValue"
      />
    </template>
  </v-card>
</template>

<script>
import dayjs from "dayjs";
import { ENUM_COMMENT_DIALOG_STATUS } from "../lib/enum";

export default {
  name: "CommentDialogModal",
  props: ["selectedDialog"],
  methods: {
    createMessage() {
      this.isSending = true;

      this.$emit("createComment", this.inputValue);
    },
    updateDialogStatus(status) {
      this.isSending = true;

      this.$emit("updateDialogStatus", status);
    },
    resetInput(clearInput = true) {
      if (clearInput) {
        this.inputValue = "";
      }
      this.resolved = false;
      this.isSending = false;
    },
  },
  computed: {
    dayjs() {
      return dayjs;
    },
  },
  data: () => ({
    inputValue: "",
    isSending: false,
    resolved: false,
    ENUM_COMMENT_DIALOG_STATUS,
  }),
};
</script>

<style scoped>
.scroll {
  overflow-y: scroll;
}
</style>
